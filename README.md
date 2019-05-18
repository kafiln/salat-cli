# Description

## Daily prayer time in all the cities in Morocco, directly in your terminal , at the tip of your fingers

A stupid simple Command line utility to get the daily prayers time for all the citiy in Morocco

The source of the data is [the Moroccan Ministery Website](http://www.habous.gov.ma)

## Getting started

```bash

```

## Output

```bash
# The programs prints to the console the prayers' time for the current day in the default city as shown bellow:
```

## Dependecies

The code behind depends on :

- `(axios)[https://github.com/axios/axios]` to make an http request ( fetch the data).
- `(jsdom)[https://github.com/jsdom/jsdom]` to parse the html result.
- `(chalk)[https://github.com/chalk/chalk]` to avoid boring styles and colors.

<img src="images/demo.png">

## Change the default city

- The default city is `Casablanca`, set as value `80` for the variable `DEFAULT_CITY` in `./constants.js`

- You can change it by replacing `80` by the value of your city based on the table below :

| ID  | CityName           |
| --- | ------------------ |
| 1   | Feguig             |
| 2   | Oujda              |
| 3   | Bouâarfa           |
| 4   | Jrada              |
| 5   | Berkane            |
| 6   | Ain châir          |
| 7   | Taourirt           |
| 8   | Nador              |
| 9   | Melilla            |
| 10  | Bouânane           |
| 11  | Guersif            |
| 12  | Boutagit           |
| 13  | Tandit             |
| 14  | Aknoul             |
| 15  | Alhoceima          |
| 16  | Missour            |
| 17  | Taza               |
| 18  | Bourd              |
| 19  | Arfoud             |
| 20  | Rissani            |
| 21  | Oued Amlil         |
| 22  | Tehla              |
| 23  | Errachidia         |
| 24  | Rich               |
| 25  | Menzal beni yazgha |
| 26  | Taounat            |
| 27  | Tissa              |
| 28  | Boulemane          |
| 29  | Midelet            |
| 30  | Sefrou             |
| 31  | Guelmima           |
| 32  | Fes                |
| 33  | Imouzar Kandar     |
| 34  | Tinjdad            |
| 35  | Ifrane             |
| 36  | Moulay Yaâgoub     |
| 37  | Azrou              |
| 38  | Chefchaouan        |
| 39  | Sebta              |
| 40  | Tetouan            |
| 41  | Hajb               |
| 42  | Zerhoune           |
| 43  | Meknes             |
| 44  | Ouazane            |
| 45  | Khénifra           |
| 46  | Sidi kacém         |
| 47  | Tizi ousli         |
| 48  | Tanger             |
| 49  | Zagoura            |
| 50  | Laksar lakbire     |
| 51  | Arbaoua            |
| 52  | Sidi Slimane       |
| 53  | Souq Arbiâ Gharb   |
| 54  | Assila             |
| 55  | Khémissat          |
| 56  | Kalâa Megouna      |
| 57  | Araich             |
| 58  | Moulay Bouâaza     |
| 59  | Kesbat Tadla       |
| 60  | Sidi yahya lgharb  |
| 61  | Tiflet             |
| 62  | Beni Mellal        |
| 63  | Meskoura           |
| 64  | Oued Zam           |
| 65  | Azilal             |
| 66  | Oued zam           |
| 67  | Kénitra            |
| 68  | Remani             |
| 6   | 9 Rabat Salé       |
| 70  | Khouribga          |
| 71  | Ouerzazat          |
| 72  | Demnat             |
| 73  | Ben slimane        |
| 74  | Bouznika           |
| 75  | Lgara              |
| 76  | Mohammedia         |
| 77  | kelâat Esraghna    |
| 78  | Berrchid           |
| 79  | Settat             |
| 80  | Casablanca         |
| 81  | Talouine           |
| 82  | Bengrire           |
| 83  | Tata               |
| 84  | Marrakech          |
| 85  | Akka               |
| 86  | Azemour            |
| 87  | Aghram             |
| 88  | Eljadida           |
| 89  | Youssoufia         |
| 90  | Taroudent          |
| 91  | Tafraout           |
| 92  | Safi               |
| 93  | Zag                |
| 94  | Assa               |
| 95  | Agadir             |
| 96  | Tiznit             |
| 97  | Essaouira          |
| 98  | Gelmim             |
| 99  | Sidi Ifni          |
| 100 | Tantan             |
| 101 | Smara              |
| 102 | Terfaya            |
| 103 | Laayoune           |
| 104 | Boujdour           |
| 105 | Dakhla             |
| 106 | Lagouira           |
| 107 | Alnif              |
| 108 | Aljaad             |
| 109 | Ousrad             |
| 110 | Tinghir            |
| 111 | Baha               |
| 112 | Fnideq             |
| 113 | Skhour Rhamna      |
| 114 | Ifni               |
| 115 | Ouazane            |
| 116 | Fqih Ben Saleh     |

- For example if your city is `Marrakech`, it's value is `84`

<img src="images/demo2.png">

# Help

Please keep in mind that this is a work in progress in a very early stages, any help is appreciated and more than welcome.

# Todo

- Command to set the default city
- Command to display the list of available cities

Show your support ==> Star the repo
If you think this is not a useless piece of code
