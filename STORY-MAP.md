# Lernquest – Story Map und Umsetzungspakete

## 1. Produktkern

**Zielgruppe:** Ein zwölfjähriger Schüler, der die App zunächst gemeinsam mit seiner Mutter bei den Hausaufgaben nutzt.

**Problem:** Der Einstieg in Hausaufgaben fällt schwer. Erledigtes wird wenig als eigener Fortschritt wahrgenommen.

**Produktversprechen:** Die App verwandelt eine reale Hausaufgabe in eine überschaubare Quest, begleitet deren Bearbeitung und macht den Abschluss durch sichtbaren Fortschritt und eine kleine Überraschung spürbar.

**Erfolg einer Quest:** Die ausgewählte Aufgabe wurde beendet und gemeinsam bestätigt. Die benötigte Zeit ist kein Erfolgskriterium.

## 2. Ziele der ersten Iteration

- Mutter und Kind können eine konkrete Hausaufgabe in weniger als einer Minute erfassen.
- Die App formuliert daraus eine verständliche Quest und schlägt sie vor.
- Das Kind kann die Quest starten und als beendet markieren.
- Die Mutter kann den Abschluss gemeinsam mit dem Kind bestätigen.
- Jede bestätigte Quest erzeugt sichtbaren Fortschritt und eine kleine Überraschung.
- Der Zustand bleibt nach dem Schließen der App auf demselben Gerät erhalten.
- Die App ist auf Smartphone und Tablet vollständig nutzbar.

## 3. Nicht-Ziele

- Keine Benutzerkonten, Cloud-Synchronisation oder Anmeldung.
- Keine KI-generierten Aufgaben oder fachliche Prüfung der Hausaufgaben.
- Keine Duolingo-Anbindung und keine Schulplattform-Integration.
- Kein Wettbewerb, keine Rangliste und keine verlierbaren Serien.
- Kein Eltern-Dashboard oder Kontrollsystem.
- Keine vollständige Lern-, Zeitmanagement- oder Rechtschreibplattform.

## 4. Story Map

| Hausaufgabe erfassen | Quest erhalten | Quest beginnen | Aufgabe bearbeiten | Abschluss bestätigen | Fortschritt erleben |
|---|---|---|---|---|---|
| Fach auswählen | Quest-Vorschlag sehen | Quest annehmen | Quest sichtbar halten | Aufgabe als erledigt markieren | Fortschrittsstand sehen |
| Aufgabe beschreiben | Formulierung verstehen | Start bestätigen | optional Zeit sehen | gemeinsam bestätigen | Überraschung enthüllen |
| Umfang angeben | Vorschlag anpassen | Start abbrechen | Pause einlegen | nicht geschafft angeben | erledigte Quest sehen |
| mehrere Aufgaben erfassen | andere Quest wählen | | weiterarbeiten | Rückblick geben | Sammlung ansehen |
| Foto aufnehmen | Schwierigkeit berücksichtigen | | Hilfe anfordern | Stärke auswählen | nächste Etappe sehen |

### Release-Schnitt

**Iteration 1 – vollständiger Kernablauf**

- Fach, Aufgabe und Umfang erfassen
- Quest-Vorschlag anzeigen
- Quest annehmen und starten
- aktive Quest sichtbar halten
- Abschluss durch Kind und Mutter bestätigen
- Fortschritt lokal speichern und anzeigen
- zufällige Überraschung aus einer festen Sammlung enthüllen

**Iteration 2 – mehr Selbstständigkeit**

- mehrere Hausaufgaben verwalten
- zwischen Quest-Vorschlägen wechseln
- Quest bearbeiten oder ablehnen
- pausieren und später fortsetzen
- Verlauf erledigter Quests

**Iteration 3 – persönliches Lernen**

- eingesetzte Stärke auswählen
- kurze Rückschau festhalten
- hilfreiche Lernmethoden markieren
- Stärken und Methoden im Verlauf erkennen

## 5. User Stories für Iteration 1

### US-01: Hausaufgabe erfassen

**Als Mutter möchte ich eine konkrete Hausaufgabe mit Fach und Umfang erfassen, damit die App nur eine tatsächlich anstehende Aufgabe vorschlägt.**

Akzeptanzkriterien:

- Fach, Aufgabenbeschreibung und Umfang können eingegeben werden.
- Die Aufgabenbeschreibung ist ein Pflichtfeld.
- Ohne Aufgabenbeschreibung kann keine Quest erzeugt werden.
- Eine verständliche Meldung weist auf fehlende Pflichtangaben hin.
- Es wird in Iteration 1 jeweils nur eine neue Hausaufgabe erfasst.

### US-02: Quest-Vorschlag erhalten

**Als Schüler möchte ich eine kurze, verständliche Quest sehen, damit ich weiß, was ich jetzt erledigen soll.**

Akzeptanzkriterien:

- Der Vorschlag enthält Fach, Aufgabe und vereinbarten Umfang.
- Die Formulierung wird regelbasiert aus den Eingaben erzeugt; sie erfindet keine Inhalte.
- Der Vorschlag kann angenommen oder verworfen werden.
- Beim Verwerfen gelangt man zurück zur Erfassung.

### US-03: Quest starten

**Als Schüler möchte ich die vorgeschlagene Quest bewusst starten, damit der Beginn klar und verbindlich ist.**

Akzeptanzkriterien:

- Eine angenommene Quest kann über eine eindeutige Aktion gestartet werden.
- Nach dem Start werden Aufgabe, Fach und Umfang gut sichtbar angezeigt.
- Ein versehentlicher Seitenwechsel löscht die aktive Quest nicht.
- Die Quest kann nicht gleichzeitig mehrfach gestartet werden.

### US-04: Quest abschließen

**Als Schüler möchte ich angeben, dass ich meine Aufgabe beendet habe, damit mein Erfolg festgehalten wird.**

Akzeptanzkriterien:

- Eine aktive Quest kann als „fertig“ markiert werden.
- Das Markieren allein erhöht den Fortschritt noch nicht.
- Vor der gemeinsamen Bestätigung kann zur aktiven Quest zurückgekehrt werden.

### US-05: Abschluss gemeinsam bestätigen

**Als Mutter und Kind möchten wir den Abschluss gemeinsam bestätigen, damit nur wirklich beendete Aufgaben als Fortschritt zählen.**

Akzeptanzkriterien:

- Nach „fertig“ erscheint eine separate Bestätigung.
- Die Bestätigung benennt die abgeschlossene Quest.
- Erst nach der Bestätigung erhält die Quest den Status „abgeschlossen“.
- Jede Quest kann nur einmal zum Fortschritt beitragen.

### US-06: Fortschritt und Überraschung erleben

**Als Schüler möchte ich nach einer abgeschlossenen Quest sichtbaren Fortschritt und eine Überraschung erhalten, damit sich der Abschluss besonders anfühlt.**

Akzeptanzkriterien:

- Nach Bestätigung steigt ein klar sichtbarer Fortschrittswert um genau einen Schritt.
- Anschließend wird eine Überraschung aus einer kleinen, fest hinterlegten Sammlung angezeigt.
- Die Auswahl darf zufällig sein; Dopplungen sind in Iteration 1 erlaubt.
- Die Überraschung enthält keine Werbung, Käufe oder externen Links.
- Fortschritt und abgeschlossene Quest bleiben nach einem Neustart erhalten.

### US-07: App auf mobilen Geräten nutzen

**Als Mutter und Kind möchten wir die App auf Smartphone und Tablet nutzen, damit sie direkt am Ort der Hausaufgaben verfügbar ist.**

Akzeptanzkriterien:

- Alle Ansichten funktionieren ab 320 Pixel Bildschirmbreite sowie auf gängigen Tablet-Größen.
- Es entsteht kein horizontales Scrollen.
- Texte, Eingabefelder, Fortschrittsanzeige und BMX-Track bleiben vollständig sichtbar und verständlich.
- Primäre Schaltflächen besitzen eine Touch-Fläche von mindestens 44 × 44 Pixeln.
- Formulare können mit Bildschirmtastatur ausgefüllt werden, ohne dass das aktive Eingabefeld oder die Hauptaktion verdeckt wird.
- Hoch- und Querformat führen nicht zu abgeschnittenen oder überlappenden Inhalten.
- Der Kernablauf kann vollständig per Touch und ohne Hover-Interaktionen durchgeführt werden.

## 6. Umsetzungspakete

### AP-01: Projektgrundlage und Navigation

- Web-App-Grundgerüst einrichten
- Ansichten für Erfassung, Vorschlag, aktive Quest, Bestätigung und Erfolg anlegen
- einfacher, kindgerechter visueller Rahmen

**Ergebnis:** Der komplette Ablauf ist mit Platzhalterdaten durchklickbar.

### AP-02: Datenmodell und lokale Speicherung

- Datenmodell für Hausaufgabe, Quest, Status und Fortschritt definieren
- lokale Speicherung im Browser umsetzen
- ungültige oder fehlende gespeicherte Daten sicher behandeln

**Ergebnis:** Aktive und abgeschlossene Quests überstehen einen Neustart.

### AP-03: Hausaufgabenerfassung und Quest-Vorschlag

- Eingabeformular mit Validierung umsetzen
- regelbasierte Quest-Formulierung erzeugen
- Annehmen und Verwerfen ermöglichen

**Deckt ab:** US-01, US-02

### AP-04: Aktive Quest und Statuswechsel

- Quest starten
- aktive Quest anzeigen
- zulässige Statuswechsel absichern
- „fertig“ markieren und zurückkehren

**Deckt ab:** US-03, US-04

### AP-05: Gemeinsame Abschlussbestätigung

- separaten Bestätigungsschritt umsetzen
- doppelte Bestätigung verhindern
- Abschluss lokal speichern

**Deckt ab:** US-05

### AP-06: Fortschritt und Überraschungen

- einfache Fortschrittsanzeige gestalten
- kleine Sammlung altersgerechter Überraschungen hinterlegen
- Überraschung auswählen und enthüllen

**Deckt ab:** US-06

### AP-07: Qualitätssicherung und Nutzertest

- Kernablauf auf einem Smartphone und einem Tablet jeweils im Hochformat prüfen
- Tablet zusätzlich im Querformat prüfen
- Darstellung bei 320 Pixel Bildschirmbreite prüfen
- Touch-Flächen, Bildschirmtastatur und horizontales Scrollen prüfen
- Neustart während Erfassung und aktiver Quest testen
- doppelte Klicks und unvollständige Eingaben testen
- ersten begleiteten Test mit Mutter und Kind durchführen
- Beobachtungen dokumentieren, ohne während des Tests zu erklären oder zu helfen

**Ergebnis:** Entscheidung, welche Probleme vor Iteration 2 behoben werden müssen.

## 7. Empfohlene Umsetzungsreihenfolge

1. AP-01 – klickbarer Ablauf
2. Früher Verständnistest mit Mutter und Kind
3. AP-02 und AP-03 – echte Eingabe und Speicherung
4. AP-04 und AP-05 – vollständiger Abschluss
5. AP-06 – Motivationselement
6. AP-07 – Prüfung und Nutzertest

## 8. Erfolgsmessung im ersten Nutzertest

Bei einem einzelnen Testnutzer sind Prozentkennzahlen wenig aussagekräftig. Beobachtet werden stattdessen:

- Versteht das Kind den Quest-Vorschlag ohne zusätzliche Erklärung?
- Beginnt es die Hausaufgabe nach Annahme der Quest?
- Kann es den Ablauf gemeinsam mit der Mutter abschließen?
- Wird der Fortschritt wahrgenommen und verstanden?
- Löst die Überraschung erkennbare Neugier auf eine weitere Quest aus?
- An welcher Stelle greifen Mutter oder Entwickler erklärend ein?

**Erster Erfolg:** Der vollständige Ablauf gelingt einmal mit höchstens einer erklärenden Hilfestellung.

## 9. Offene Entscheidungen vor der visuellen Gestaltung

- Welches Motiv trägt den Fortschritt: Schatzkarte, Reise, Figur oder wachsende Welt?
- Welche Überraschungen empfindet das Kind tatsächlich als interessant?
- Muss die Mutter jede Quest bestätigen, oder soll dies später optional werden?
- Soll ein nicht abgeschlossener Versuch gespeichert werden, ohne den Fortschritt zu erhöhen?

Keine dieser Fragen blockiert den klickbaren ersten Ablauf. Motiv und Überraschungen sollten jedoch vor AP-06 gemeinsam mit dem Kind ausgewählt werden.

---

## 10. Erweiterung: Begrenzte Run-Runden

### Problem

Der aktuelle Fortschritt zeigt fünf Runs, begrenzt die Nutzung aber nicht. Nach dem fünften Run können beliebig weitere Runs gestartet werden; dadurch fehlt einer Lernrunde ein bewusst gesetztes Ziel und ein erkennbares Ende.

### Produktentscheidung

Mutter und Kind legen vor Beginn einer Runde gemeinsam fest, wie viele Runs sie schaffen möchten. Eine Runde umfasst **ein bis fünf Runs**. Das Ziel kann nach dem ersten gestarteten Run nicht mehr verändert werden. Sobald alle geplanten Runs abgeschlossen sind, endet die Runde verbindlich auf einer Abschlussseite. Ein weiterer Run ist erst nach dem bewussten Start einer neuen Runde möglich.

### User Stories

#### US-08: Run-Ziel festlegen

**Als Mutter und Kind möchten wir vor Beginn festlegen, wie viele Runs wir heute schaffen wollen, damit die Runde überschaubar und realistisch bleibt.**

Akzeptanzkriterien:

- Vor der ersten Hausaufgabe einer neuen Runde wird ein Ziel zwischen einem und fünf Runs ausgewählt.
- Ohne ausgewähltes Ziel kann keine Runde gestartet werden.
- Das gewählte Ziel wird vor dem Start deutlich angezeigt.
- Nach Beginn des ersten Runs kann das Ziel nicht mehr verändert werden.
- Das Ziel bleibt nach dem Schließen oder Neuladen der App erhalten.

#### US-09: Dynamischen Rundenfortschritt sehen

**Als Schüler möchte ich jederzeit sehen, wie viele Runs meiner aktuellen Runde bereits geschafft sind, damit das Ziel greifbar bleibt.**

Akzeptanzkriterien:

- Die Kopfzeile zeigt „abgeschlossene Runs / geplante Runs“, beispielsweise „2 / 3 Runs“.
- Track und Fortschrittsbalken verwenden das gewählte Ziel anstelle eines festen Werts von fünf.
- Jeder bestätigte Run erhöht den Rundenfortschritt genau einmal.
- Der Fortschritt kann das gewählte Ziel nicht überschreiten.
- Frühere Runs aus abgeschlossenen Runden zählen nicht zur aktuellen Runde.

#### US-10: Runde verbindlich abschließen

**Als Schüler möchte ich nach dem letzten geplanten Run eine Abschlussseite sehen, damit ich die gesamte Runde als Erfolg wahrnehme.**

Akzeptanzkriterien:

- Nach Bestätigung des letzten geplanten Runs erscheint die Rundenabschlussseite statt der üblichen Seite „Nächster Run“.
- Die Abschlussseite zeigt die Anzahl abgeschlossener Runs und die gesamte benötigte Zeit.
- Die einzelnen Quests der Runde werden mit Fach, Aufgabe und Laufzeit zusammengefasst.
- Auf der Abschlussseite kann kein weiterer Run zur beendeten Runde hinzugefügt werden.
- Eine abgeschlossene Runde bleibt nach einem Neustart abgeschlossen.

#### US-11: Neue Runde beginnen

**Als Mutter und Kind möchten wir nach einem Abschluss bewusst eine neue Runde starten, damit wir ein neues realistisches Ziel vereinbaren können.**

Akzeptanzkriterien:

- Die Abschlussseite bietet die eindeutige Aktion „Neue Runde planen“.
- Vor der nächsten Hausaufgabe muss erneut ein Ziel zwischen einem und fünf Runs gewählt werden.
- Die abgeschlossene Runde bleibt im Verlauf erhalten.
- Fortschritt und Timer der neuen Runde beginnen bei null.

### Nicht-Ziele dieser Erweiterung

- Keine automatische Empfehlung für die optimale Anzahl an Runs.
- Keine Änderung des Ziels während einer laufenden Runde.
- Keine täglichen Serien, Ranglisten oder Strafen für abgebrochene Runden.
- Keine zeitliche Obergrenze für eine Runde.
- Keine Synchronisierung einer Runde zwischen mehreren Geräten.

## 11. Aufgabenpakete für begrenzte Run-Runden

### AP-08: Runden-Datenmodell und Migration

- Datenmodell für aktuelle und abgeschlossene Runden ergänzen
- Zielanzahl, Rundenstatus, Start- und Abschlusszeit speichern
- abgeschlossene Quests eindeutig einer Runde zuordnen
- vorhandene lokal gespeicherte Quests ohne Datenverlust übernehmen
- ungültige oder unvollständige Altdaten sicher behandeln

**Ergebnis:** Die App kann eine laufende Runde eindeutig von früheren Runden unterscheiden.

### AP-09: Rundenplanung

- neue Startansicht zur Auswahl von ein bis fünf Runs gestalten
- Auswahl und Bestätigung des Rundenziels umsetzen
- Änderung vor dem ersten Run ermöglichen
- Änderung nach Beginn sperren
- mobile Darstellung und Touch-Bedienung sicherstellen

**Deckt ab:** US-08

### AP-10: Dynamischer Fortschritt

- feste „5 Runs“-Logik durch das gewählte Rundenziel ersetzen
- Kopfzeile, Fortschrittsbalken und Fahrerposition dynamisch berechnen
- Überlaufen über das Rundenlimit technisch verhindern
- Wiederherstellung des korrekten Fortschritts nach Neuladen prüfen

**Deckt ab:** US-09

### AP-11: Abschlusslogik und Rundenabschlussseite

- nach jedem bestätigten Run prüfen, ob das Rundenziel erreicht ist
- beim letzten Run zur Rundenabschlussseite weiterleiten
- Gesamtzeit aus den Laufzeiten der Rundenquests berechnen
- Zusammenfassung aller Runs der Runde anzeigen
- „Nächster Run“ auf einer beendeten Runde entfernen

**Deckt ab:** US-10

### AP-12: Neue Runde starten

- Aktion „Neue Runde planen“ ergänzen
- abgeschlossene Runde dauerhaft archivieren
- aktive Quest, Timer und Rundenfortschritt sauber zurücksetzen
- erneute Zielauswahl erzwingen

**Deckt ab:** US-11

### AP-13: Questverlauf auf Runden erweitern

- Verlauf nach Runden gruppieren
- Ziel, tatsächlich abgeschlossene Runs und Gesamtzeit je Runde anzeigen
- laufende und abgeschlossene Runden visuell unterscheiden
- ältere Einzelquests aus der bisherigen Datenstruktur weiterhin anzeigen

**Ergebnis:** Der Verlauf erzählt nicht nur einzelne Aufgaben, sondern abgeschlossene Lernrunden.

### AP-14: Qualitätssicherung und Nutzertest

- Ziele von einem, drei und fünf Runs vollständig durchspielen
- Neuladen während Planung, laufendem Run und Abschluss testen
- doppelte Bestätigung des letzten Runs verhindern
- prüfen, dass nach Erreichen des Ziels kein weiterer Run möglich ist
- neue Runde starten und Trennung der Verläufe prüfen
- Smartphone und Tablet im Hochformat sowie Tablet im Querformat testen
- Nutzertest mit einer echten Hausaufgabenrunde durchführen

**Erfolgskriterium:** Mutter und Kind können ein Ziel festlegen, genau diese Anzahl an Runs abschließen und anschließend selbstständig eine neue Runde planen.

## 12. Empfohlene Umsetzungsreihenfolge der Erweiterung

1. AP-08 – Datenmodell und sichere Migration
2. AP-09 – Rundenplanung
3. AP-10 – dynamischer Fortschritt
4. AP-11 – verbindliches Rundenende
5. AP-12 – neue Runde
6. AP-13 – gruppierter Verlauf
7. AP-14 – Geräteprüfung und Nutzertest
