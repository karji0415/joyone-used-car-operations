VERSION 1.0 CLASS
BEGIN
  MultiUse = -1  'True
END
Attribute VB_Name = "JOYoneFolderWatcher"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = False
Attribute VB_Exposed = False
Option Explicit

Public WithEvents WatchedItems As Outlook.Items
Attribute WatchedItems.VB_VarHelpID = -1

Private Sub WatchedItems_ItemAdd(ByVal Item As Object)
    On Error GoTo ArchiveError
    If TypeOf Item Is Outlook.MailItem Then
        JOYoneMailArchive.ArchiveMailItem Item
    End If
    Exit Sub

ArchiveError:
    JOYoneMailArchive.WriteJOYoneLog "ItemAdd", Err.Number, Err.Description
End Sub
