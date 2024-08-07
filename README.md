## Link zur Website: [Join/login](https://tarik-uyan.developerakademie.net/Join/init/login/login.html)

Dies ist das Kanban-Projekt **Join** im Rahmen der Frontend-Ausbildung der Developerakademie erstellt von **Lukas Busch** und **Tarik Uyan**.

<details>
<summary>Features</summary>
  
# Features

-   **Registrierung & Verifizierung**: Bei der Registrierung eines neuen Kontos bei Join wird nach der Eingabe von Nutzername, Mailadresse und Passwort und dem Bestätigen der Datenschutzbestimmungen eine **_E-Mail zur Verifizierung_** verschickt. Um das Konto zu bestätigen, kann auf den **_Link in der E-Mail_** geklickt oder der Verifizierungscode händisch oder per Copy & Paste auf der Verifizierungsseite eingegeben und abgeschickt werden.
-   **Konto erstellen**: Es ist möglich, ein Profilbild hochzuladen (und auch wieder zu löschen) und eine Profilfarbe auszuwählen.
-   **Login**: mit optionaler Speicherung der Anmeldedaten
-   **Password zurücksetzen**: Das Zurücksetzen des Passworts funktioniert wie die Verifizierung auch **_per E-Mail_**.

##

-   **Automatischer Logout**: nach 5 Minuten Inaktivität (document.visibilityState === "hidden")
-   **Benachrichtigunen & Websocket Server**: Beim Senden einer Kontaktanfrage, Mitwirkenden-Einladung oder bei der Zuweisung einer Aufgabe and einen Mitwirkenden erhält dieser - falls online - eine Live-Benachrichtigung. Dafür wurde ein **_Websocket Server_** implementiert.
-   **Kontoeinstellungen**: Beim Klicken auf das eigene Profil rechts oben öffnen sich die Kontoeinstellungen. Hier lassen sich **_Benachrichtigungen einsehen_**, **_Kontaktanfragen_** und **_Tafeleinladungen_** ablehnen oder akzeptieren, das **_Passwort zurücksetzen_** oder das **_Konto löschen_**. Außerdem kann sich der Nutzer hier **_abmelden_**.
-   **Sprachen**: Je nach eingestellter Standardsprache im Browser wird die Sprache geladen. Außerdem sind Spracheinstellungen beim Login und in den Kontoeinstellungen zu finden.

##

-   **Tafel erstellen**: es gibt nicht nur keine Standard-Tafel, man muss sogar erst eine **_erstellen_** oder zu einer anderen **_eingeladen werden_** (bei neu erstelltem Account). Es kann ein Name bestimmt, Kategorien festgelegt und Mitwirkende eingeladen werden.
-   **Tafel bearbeiten**: nach der Erstellung lässt sich (nur vom Ersteller) die Tafel bearbeiten, es können Mitwirkende per Einladung hinzugefügt (aber nicht wieder entfernt!) werden, Kategorien können hinzugefügt oder gelöscht werden.
-   **Tafel löschen**: ganze Boards können auch gelöscht werden (mit Bestätigung).
-   **Tafel auswählen**: um die **_aktive Tafel_** auszuwählen, muss zuerst auf "Übersicht"/"Summary" und dann ggf. auf "Tafel auswählen"/"Select Board" geklickt werden. Dann in der Auswahl auf die gewünschte Tafel klicken.

##

-   **Aufgaben erstellen**: einzelne Aufgaben (mitsamt **_Unteraufgaben_**) können erstellt werden und Mitwirkende der entsprechenden Tafel können Aufgaben zugewiesen werden.
-   **Aufgaben bearbeiten/löschen**: Aufgaben können bearbeitet und gelöscht werden.
-   **Verschieben der Aufgaben**: Aufgaben können in der Board-Ansicht zwischen den 4 Typen **_to do_**, **_in progress_**, **_awaiting feedback_** und **_done_** per **_Drag & Drop_** verschoben werden.

##

-   **Kontakt- & Mitwirkendenanfrage**: Beim Hinzufügen eines Kontaktes oder dem eines Mitwirkenden wird eine **_Anfrage gesendet_**, die erst vom Empfänger bestätigt werden muss, bevor dieser in den Kontakten / der Tafel gespeichert ist.
-   **Kontakte hinzufügen**: Um einen neuen Kontakt hinzuzufügen, muss **_zumindest ein Teil_** eines Namens in das Suchfeld eingegeben werden, bevor Suchergebnisse angezeigt werden. Bei Hinzufügen des Kontakts wird an diesen lediglich eine **_Kontaktanfrage_** gesendet, welche erst **_bestätigt_** oder **_abgelehnt_** werden muss.
</details>

<details>
<summary>Aufgabenverteilung</summary>
  
# Aufgabenverteilung

## Lukas Busch

-   Add Task
-   Contacts / Add Contact
-   Übersetzung & Sprache
-   Privacy / Legal Notice / Help
-   Das meiste vom Responsive Design

## Tarik Uyan

-   Signup / Login / Forgot_Password / Verify_Account / Create_Account
-   Storage
-   Websocket Server & Notifications
-   E-mails & Foto-Upload
-   Summary / New Board / Edit Board
-   Board / Drag & Drop

## Zusammen

-   Account Panel
-   Delete Account
-   Edit Task
-   JSDOC

</details>

# !BITTE LESEN!

**_An die-/denjenige(n), die/der uns zu unserem Projekt Feedback gibt:_**

### 1.

Es würde uns sehr freuen, wenn du mal den Prozess der Registrierung mitsamt E-Mail-Verifikation durchlaufen würdest :)

### 2.

Da das Hinzufügen von Kontakten und Mitwirkenden eine Bestätigung der jeweiligen Person erfordert,
wird empfohlen sich mit einem eigens erstellten Account und dem Gast Account anzumelden (z.B. in einem anderen Tab oder Browser) um dies zu testen.

### 3.

Da alle Serverfunktionen auf einem kostenlosen Server gehostet werden, welcher nach einer gewissen Zeit an Inaktivität herunterfährt und dann nach erneuter Anfrage erst wieder hochfahren muss, kann es es sein, dass es zu Verzögerungen von bis zu einer Minute (z.B. bei E-Mail, Bild-Upload oder Live-Benachrichtigung) kommen kann.
