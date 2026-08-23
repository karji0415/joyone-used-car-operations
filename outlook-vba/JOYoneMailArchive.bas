Attribute VB_Name = "JOYoneMailArchive"
Option Explicit

Private Const APP_NAME As String = "JOYone"
Private Const SETTINGS_SECTION As String = "MailArchive"
Private Const SETTINGS_KEY As String = "ArchiveRoot"
Private Const WATCH_FOLDER_NAME As String = "JOYone 邮寄"
Private Const INDEX_FILE_NAME As String = "mail-index.csv"
Private Const LOG_FILE_NAME As String = "joyone-archive.log"

Public gJOYoneWatcher As JOYoneFolderWatcher
Private gArchiveRoot As String

Public Sub InitializeJOYoneWatcher()
    On Error GoTo InitError
    Dim targetFolder As Outlook.Folder
    Set targetFolder = GetWatchFolder(True)
    If targetFolder Is Nothing Then Exit Sub

    gArchiveRoot = GetSetting(APP_NAME, SETTINGS_SECTION, SETTINGS_KEY, "")
    If Len(gArchiveRoot) = 0 Or Not FolderExists(gArchiveRoot) Then
        gArchiveRoot = ChooseArchiveRoot()
        If Len(gArchiveRoot) = 0 Then Exit Sub
        SaveSetting APP_NAME, SETTINGS_SECTION, SETTINGS_KEY, gArchiveRoot
    End If

    Set gJOYoneWatcher = New JOYoneFolderWatcher
    Set gJOYoneWatcher.WatchedItems = targetFolder.Items
    RebuildJOYoneIndex
    Exit Sub

InitError:
    WriteJOYoneLog "Initialize", Err.Number, Err.Description
    MsgBox "JOYone 邮件归档未能启动。请查看归档目录中的日志。", vbExclamation, "JOYone"
End Sub

Public Sub ReleaseJOYoneWatcher()
    Set gJOYoneWatcher = Nothing
End Sub

Public Sub SelectJOYoneArchiveFolder()
    Dim selectedPath As String
    selectedPath = ChooseArchiveRoot()
    If Len(selectedPath) = 0 Then Exit Sub
    gArchiveRoot = selectedPath
    SaveSetting APP_NAME, SETTINGS_SECTION, SETTINGS_KEY, gArchiveRoot
    MsgBox "归档目录已设置。重新启动 Outlook 后生效。", vbInformation, "JOYone"
End Sub

Public Sub RebuildJOYoneIndex()
    On Error GoTo RebuildError
    Dim targetFolder As Outlook.Folder
    Dim item As Object
    Set targetFolder = GetWatchFolder(False)
    If targetFolder Is Nothing Then Exit Sub
    If Len(ArchiveRoot()) = 0 Then Exit Sub

    For Each item In targetFolder.Items
        If TypeOf item Is Outlook.MailItem Then ArchiveMailItem item
    Next item
    Exit Sub

RebuildError:
    WriteJOYoneLog "Rebuild", Err.Number, Err.Description
End Sub

Public Sub ArchiveMailItem(ByVal mail As Outlook.MailItem)
    On Error GoTo ArchiveError
    If mail Is Nothing Then Exit Sub
    If Len(ArchiveRoot()) = 0 Then Exit Sub

    Dim vins As Collection
    Set vins = ExtractVins(mail.Body & vbCrLf & mail.Subject)
    If vins.Count = 0 Then Exit Sub

    Dim trackingNumber As String
    Dim contentType As String
    Dim mailDealer As String
    Dim messageKey As String
    trackingNumber = ExtractTrackingNumber(mail.Body)
    contentType = ExtractContentType(mail.Subject & vbCrLf & mail.Body)
    mailDealer = ExtractMailDealer(mail.Subject, mail.Body)
    messageKey = StableMessageKey(mail)

    Dim monthFolder As String
    Dim relativePath As String
    Dim msgPath As String
    monthFolder = Format(mail.ReceivedTime, "yyyy-mm")
    EnsureFolder ArchiveRoot() & "\" & monthFolder
    relativePath = monthFolder & "\" & SafeFileName(Format(mail.ReceivedTime, "yyyymmdd_hhnnss") & "_" & IIf(Len(trackingNumber) > 0, trackingNumber, "NO_TRACKING") & "_" & Right$(messageKey, 8)) & ".msg"
    msgPath = ArchiveRoot() & "\" & relativePath
    If Not FileExists(msgPath) Then mail.SaveAs msgPath, olMSGUnicode

    Dim vin As Variant
    Dim rowKey As String
    Dim indexPath As String
    indexPath = ArchiveRoot() & "\" & INDEX_FILE_NAME
    EnsureIndexHeader indexPath
    For Each vin In vins
        rowKey = messageKey & "|" & CStr(vin) & "|" & trackingNumber & "|" & contentType
        If Not IndexContainsKey(indexPath, rowKey) Then
            AppendUtf8Line indexPath, BuildIndexLine(rowKey, messageKey, CStr(vin), trackingNumber, contentType, mailDealer, mail, relativePath)
        End If
    Next vin
    Exit Sub

ArchiveError:
    WriteJOYoneLog "ArchiveMailItem", Err.Number, Err.Description
End Sub

Private Function BuildIndexLine(ByVal rowKey As String, ByVal messageKey As String, ByVal vin As String, ByVal trackingNumber As String, ByVal contentType As String, ByVal mailDealer As String, ByVal mail As Outlook.MailItem, ByVal relativePath As String) As String
    Dim vehicleBlock As String
    vehicleBlock = TextNearVin(mail.Body, vin)
    BuildIndexLine = CsvValue(rowKey) & "," & _
        CsvValue(messageKey) & "," & CsvValue(vin) & "," & CsvValue(trackingNumber) & "," & _
        CsvValue(contentType) & "," & CsvValue(mailDealer) & "," & CsvValue(Format(mail.SentOn, "yyyy-mm-dd")) & "," & _
        CsvValue(ExtractLabeledValue(vehicleBlock, "车型|车型号|Model")) & "," & _
        CsvValue(ExtractLabeledValue(vehicleBlock, "车牌号|车牌|Plate")) & "," & _
        CsvValue(ExtractLabeledValue(vehicleBlock, "二手车批售价|批售价|Used Car Wholesale Price")) & "," & _
        CsvValue(ExtractLabeledValue(vehicleBlock, "拍卖经销商|购买经销商|Auction Dealer")) & "," & _
        CsvValue(relativePath) & "," & CsvValue(IIf(Len(trackingNumber) > 0, "parsed", "missing_tracking")) & "," & _
        CsvValue(Format(Now, "yyyy-mm-dd hh:nn:ss"))
End Function

Private Sub EnsureIndexHeader(ByVal indexPath As String)
    If FileExists(indexPath) Then Exit Sub
    AppendUtf8Line indexPath, "rowKey,messageKey,vin,trackingNumber,mailContent,mailDealer,mailDate,model,plate,usedWholesalePrice,auctionDealer,msgRelativePath,parseStatus,archivedAt"
End Sub

Private Function ExtractVins(ByVal text As String) As Collection
    Dim results As New Collection
    Dim seen As Object
    Dim regex As Object
    Dim matches As Object
    Dim match As Object
    Set seen = CreateObject("Scripting.Dictionary")
    Set regex = CreateObject("VBScript.RegExp")
    regex.Global = True
    regex.IgnoreCase = True
    regex.Pattern = "\b[A-HJ-NPR-Z0-9]{17}\b"
    Set matches = regex.Execute(UCase$(text))
    For Each match In matches
        If Not seen.Exists(match.Value) Then
            seen.Add match.Value, True
            results.Add match.Value
        End If
    Next match
    Set ExtractVins = results
End Function

Private Function ExtractTrackingNumber(ByVal text As String) As String
    ExtractTrackingNumber = FirstRegex(text, "(邮寄单号|快递单号|运单号|Tracking Number|Tracking)[：:]?\s*([A-Z0-9-]{6,})", 1, True)
End Function

Private Function ExtractContentType(ByVal text As String) As String
    Dim parts As String
    If InStr(1, text, "合同", vbTextCompare) > 0 Then parts = "合同"
    If InStr(1, text, "材料", vbTextCompare) > 0 Then parts = parts & IIf(Len(parts) > 0, "＋", "") & "材料"
    If InStr(1, text, "委托书", vbTextCompare) > 0 Then parts = parts & IIf(Len(parts) > 0, "＋", "") & "委托书"
    ExtractContentType = parts
End Function

Private Function ExtractMailDealer(ByVal subjectText As String, ByVal bodyText As String) As String
    Dim dealer As String
    dealer = ExtractLabeledValue(bodyText, "邮寄经销商|收件经销商")
    If Len(dealer) > 0 Then ExtractMailDealer = dealer: Exit Function
    dealer = subjectText
    dealer = Replace(dealer, "合同", "")
    dealer = Replace(dealer, "材料", "")
    dealer = Replace(dealer, "委托书", "")
    dealer = Replace(dealer, "邮寄", "")
    dealer = Replace(dealer, "+", "")
    dealer = Replace(dealer, "＋", "")
    ExtractMailDealer = Trim$(dealer)
End Function

Private Function ExtractLabeledValue(ByVal text As String, ByVal labels As String) As String
    ExtractLabeledValue = FirstRegex(text, "(" & labels & ")[：:]\s*([^\r\n]+)", 1, False)
End Function

Private Function FirstRegex(ByVal text As String, ByVal pattern As String, ByVal groupIndex As Long, ByVal ignoreCase As Boolean) As String
    Dim regex As Object
    Dim matches As Object
    Set regex = CreateObject("VBScript.RegExp")
    regex.Global = False
    regex.IgnoreCase = ignoreCase
    regex.MultiLine = True
    regex.Pattern = pattern
    Set matches = regex.Execute(text)
    If matches.Count = 0 Then Exit Function
    If matches(0).SubMatches.Count > groupIndex Then FirstRegex = Trim$(matches(0).SubMatches(groupIndex)) Else FirstRegex = Trim$(matches(0).Value)
End Function

Private Function TextNearVin(ByVal bodyText As String, ByVal vin As String) As String
    Dim startAt As Long
    Dim blockStart As Long
    Dim blockEnd As Long
    Dim nextAt As Long
    startAt = InStr(1, bodyText, vin, vbTextCompare)
    If startAt = 0 Then TextNearVin = bodyText: Exit Function
    blockStart = InStrRev(Left$(bodyText, startAt), vbCrLf & vbCrLf)
    If blockStart > 0 Then blockStart = blockStart + 4 Else blockStart = startAt - 400
    If blockStart < 1 Then blockStart = 1
    nextAt = startAt + Len(vin)
    Dim tail As String
    tail = Mid$(bodyText, nextAt)
    Dim nextVin As String
    nextVin = FirstRegex(tail, "\b[A-HJ-NPR-Z0-9]{17}\b", 0, True)
    If Len(nextVin) > 0 Then
        nextAt = InStr(1, tail, nextVin, vbTextCompare)
        blockEnd = startAt + Len(vin) + nextAt - 2
        TextNearVin = Mid$(bodyText, blockStart, blockEnd - blockStart + 1)
    Else
        TextNearVin = Mid$(bodyText, blockStart, 1600)
    End If
End Function

Private Function StableMessageKey(ByVal mail As Outlook.MailItem) As String
    If Len(mail.EntryID) > 0 Then StableMessageKey = mail.EntryID Else StableMessageKey = Format(mail.ReceivedTime, "yyyymmddhhnnss") & "-" & SafeFileName(mail.Subject)
End Function

Private Function CsvValue(ByVal value As String) As String
    CsvValue = Chr$(34) & Replace(value, Chr$(34), Chr$(34) & Chr$(34)) & Chr$(34)
End Function

Private Function IndexContainsKey(ByVal indexPath As String, ByVal rowKey As String) As Boolean
    If Not FileExists(indexPath) Then Exit Function
    IndexContainsKey = InStr(1, ReadUtf8Text(indexPath), CsvValue(rowKey), vbBinaryCompare) > 0
End Function

Private Sub AppendUtf8Line(ByVal filePath As String, ByVal lineText As String)
    Dim existing As String
    If FileExists(filePath) Then existing = ReadUtf8Text(filePath)
    If Len(existing) > 0 And Right$(existing, 2) <> vbCrLf Then existing = existing & vbCrLf
    WriteUtf8TextAtomic filePath, existing & lineText & vbCrLf
End Sub

Private Function ReadUtf8Text(ByVal filePath As String) As String
    Dim stream As Object
    Set stream = CreateObject("ADODB.Stream")
    stream.Type = 2
    stream.Charset = "utf-8"
    stream.Open
    stream.LoadFromFile filePath
    ReadUtf8Text = stream.ReadText
    stream.Close
End Function

Private Sub WriteUtf8TextAtomic(ByVal filePath As String, ByVal text As String)
    Dim stream As Object
    Dim fso As Object
    Dim tempPath As String
    tempPath = filePath & ".tmp"
    Set stream = CreateObject("ADODB.Stream")
    stream.Type = 2
    stream.Charset = "utf-8"
    stream.Open
    stream.WriteText text
    stream.SaveToFile tempPath, 2
    stream.Close
    Set fso = CreateObject("Scripting.FileSystemObject")
    If fso.FileExists(filePath) Then fso.DeleteFile filePath, True
    fso.MoveFile tempPath, filePath
End Sub

Private Function GetWatchFolder(ByVal createIfMissing As Boolean) As Outlook.Folder
    Dim inbox As Outlook.Folder
    Dim target As Outlook.Folder
    Set inbox = Application.Session.GetDefaultFolder(olFolderInbox)
    On Error Resume Next
    Set target = inbox.Folders(WATCH_FOLDER_NAME)
    On Error GoTo 0
    If target Is Nothing And createIfMissing Then Set target = inbox.Folders.Add(WATCH_FOLDER_NAME)
    Set GetWatchFolder = target
End Function

Private Function ArchiveRoot() As String
    If Len(gArchiveRoot) = 0 Then gArchiveRoot = GetSetting(APP_NAME, SETTINGS_SECTION, SETTINGS_KEY, "")
    ArchiveRoot = gArchiveRoot
End Function

Private Function ChooseArchiveRoot() As String
    Dim shellApp As Object
    Dim selected As Object
    Set shellApp = CreateObject("Shell.Application")
    Set selected = shellApp.BrowseForFolder(0, "选择 JOYone 邮件归档文件夹", 0)
    If selected Is Nothing Then Exit Function
    ChooseArchiveRoot = selected.Self.Path
End Function

Private Function SafeFileName(ByVal value As String) As String
    Dim invalid As Variant
    Dim item As Variant
    invalid = Array("\", "/", ":", "*", "?", """", "<", ">", "|")
    SafeFileName = value
    For Each item In invalid
        SafeFileName = Replace(SafeFileName, CStr(item), "_")
    Next item
    If Len(SafeFileName) > 120 Then SafeFileName = Left$(SafeFileName, 120)
End Function

Private Sub EnsureFolder(ByVal folderPath As String)
    Dim fso As Object
    Set fso = CreateObject("Scripting.FileSystemObject")
    If Not fso.FolderExists(folderPath) Then fso.CreateFolder folderPath
End Sub

Private Function FileExists(ByVal filePath As String) As Boolean
    FileExists = CreateObject("Scripting.FileSystemObject").FileExists(filePath)
End Function

Private Function FolderExists(ByVal folderPath As String) As Boolean
    FolderExists = CreateObject("Scripting.FileSystemObject").FolderExists(folderPath)
End Function

Public Sub WriteJOYoneLog(ByVal sourceName As String, ByVal errorNumber As Long, ByVal description As String)
    On Error Resume Next
    If Len(ArchiveRoot()) = 0 Then Exit Sub
    AppendUtf8Line ArchiveRoot() & "\" & LOG_FILE_NAME, Format(Now, "yyyy-mm-dd hh:nn:ss") & vbTab & sourceName & vbTab & CStr(errorNumber) & vbTab & description
End Sub
