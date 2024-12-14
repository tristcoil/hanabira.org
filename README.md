# Hanabira.org - Your Path to Japanese Comprehension 
## Free, Open-Source, Self-Hostable

[**Hanabira.org**](https://hanabira.org)
 is a free and (mostly) open-source Japanese learning platform designed to help you prepare for JLPT N5-N1. Our platform offers various tools to enhance your Japanese language learning experience, from text parsing and grammar explanations to YouTube immersion and kanji mnemonics. Can be easily Self-Hosted. Is in very early Alpha stage, full of bugs. 
Korean content to be added soon(ish). Tech stack is: NextJS 14, Tailwind CSS, Shad CN, MongoDB, Express, Flask, Docker. 
MIT License. Code is provides "as is" without any warranty. Use at your own risk.

## Features

- **YouTube Immersion** - Enhance learning with engaging video content.
- **Text Parser** - Easily split and tokenize custom texts.
- **Grammar Explanation** - Quick and clear grammar points with examples.
- **Word relations** - Graph with hierarchy of word relations, eg. synonyms.
- **Vocabulary SRS Cards** - Effective spaced repetition flashcards with audio.
- **Vocabulary and Sentence Mining** - Discover new words and sentences seamlessly.
- **Kanji Mnemonics (in development)** - Simplified kanji learning techniques.
- **Kanji Animation and Drawing Canvas (in development)** - Interactive kanji practice tools.

## Screenshots

### Hanabira Project
![Hanabira Project Screenshot](prod/frontend-next/public/img/screenshots/hanabira_landing.png)

### Text Parser
![Text Parser Screenshot](prod/frontend-next/public/img/screenshots/hanabira_text_parser_tokenization.png)

### YouTube Immersion
![YouTube Immersion Screenshot](prod/frontend-next/public/img/screenshots/hanabira_youtube_parser.png)

### Grammar Graph 
![Grammar Graph Screenshot](prod/frontend-next/public/img/screenshots/hanabira_grammar_graph.png)

### Grammar Explanations
![Grammar Explanations Screenshot](prod/frontend-next/public/img/screenshots/hanabira_grammar.png) 

### Word Relations
![Word Relations Screenshot](prod/frontend-next/public/img/screenshots/hanabira_word_relations.png) 





## Self-Hosting

Hanabira (https://hanabira.org/) can be easily run locally or on your server/laptop just with 3 commands. To get started quickly, you can run Hanabira public Docker images.
Images/containers are big (several GB each), unoptimized and run under root user. Use at your own risk.

1. **Quick Start**

Use clean VirtualBox Linux Ubuntu based VM machine.

Start pre-made public hanabira containers. 
```bash
git clone https://github.com/tristcoil/hanabira.org.git 
cd hanabira.org 
docker-compose up
```

Hanabira will be then accessible locally on:
http://localhost:8888/

If you cannot reach the website locally, we recommend to check if all containers are running and to clear browser cache.

Optional: Check docker-compose.yml file for path to configs where you can insert your DEEPL, OpenAI and Google analytics API keys and tracking codes.


Self hosted Hanabira in Virtual Box VM:
![Hanabira Self Hosted in Virtual Box VM](prod/frontend-next/public/img/screenshots/hanabira_vm.png) 









Note: Hanabira project has main upstream private repo, the public one contains only individual releases (not day-to-day dev progress).

## Contact
For more information, visit [Hanabira.org](https://www.hanabira.org).



# Sources & Literature

## Japanese
- Nihongo So Matome JLPT N2 series  
- Nihongo So Matome JLPT N3 series  
- Nihongo So Matome JLPT N4 series  
- Nihongo So Matome JLPT N5 series  
- 600 Basic Japanese Verbs, Tuttle Publishing  
- New Kanzen Master JLPT N3 Tango Word Book (Shin Kanzen Master: JLPT N3 1800 Important Vocabulary Words)

## Vietnamese
- Let's speak Vietnamese (Binh Nhu Ngo)  
- Vietnamese as a second language (Hue Van Nguyen)

## Web Sources

### Japanese
JLPT level vocabulary lists taken from [Tanos.co.uk](http://www.tanos.co.uk/jlpt/)

*(Eventually, we will also use Kanji JLPT lists)*  
**Licence:** Creative Commons BY - [License Details](http://www.tanos.co.uk/jlpt/)

---

### Kanjidic Project
We are using the kanji dictionary from the KANJIDIC Project.

We took the KANJIDIC2 file, which is in XML format, encoded in Unicode/UTF-8, and contains information about all 13,108 kanji. You can download the file [here](http://www.edrdg.org/kanjidic/).

After downloading, we extract the file to XML format. Then, we use our custom Python script to convert it to a JSON file for easier processing. The resulting JSON file is approximately 50 MB in size.

**Radicals - RADKFILE**  
For more information on RADKFILE, visit [this page](http://www.edrdg.org/).

**Copyright**  
The RADKFILE and KRADFILE files are copyrighted and available under the [EDRDG Licence](http://www.edrdg.org). The copyright for RADKFILE2 and KRADFILE2 is held by Jim Rose and Jim Breen.

Please note that the licence might not allow commercial use. You can read more about the licence [here](http://www.edrdg.org/edrdg/licence.html).

### License Information
The dictionary files are made available under a [Creative Commons Attribution-ShareAlike Licence (V4.0)](https://creativecommons.org/licenses/by-sa/4.0/).

The RADKFILE/KRADFILE files relate to the decomposition of the 6,355 kanji in JIS X 0208 into their visible components. However, please note that the RADKFILE2/KRADFILE2 files, which are copyrighted by Jim Breen, are not being used in our project.

---

### Mecab
We are using the Mecab package available through the apt package manager.

Additionally, we are utilizing [mecab-async](https://www.npmjs.com/package/mecab-async), an NPM package licensed under the MIT License.

### KUROSHIRO Parser
The KUROSHIRO Parser is a powerful tool for converting Japanese text into various forms. For more details, visit the [official website](https://kuroshiro.org).

The source code is available on GitHub at [github.com/hexenq/kuroshiro](https://github.com/hexenq/kuroshiro).

**KUROSHIRO** is a Node.js package and is licensed under the MIT License.

---

### JMDICT
The JMDict files are available under a [Creative Commons Attribution-ShareAlike Licence (V4.0)](https://creativecommons.org/licenses/by-sa/4.0/). You can view the [Licence Deed](https://creativecommons.org/licenses/by-sa/4.0/deed.en) and the [full Licence Code](https://creativecommons.org/licenses/by-sa/4.0/legalcode).

For the EDICT, JMdict, and KANJIDIC files, you may use or quote the following URLs:  
- [JMdict-EDICT Dictionary Project](http://www.edrdg.org/jmdict/edict.html)  
- [KANJIDIC Project](http://www.edrdg.org/kanjidic/kanjidic.html)

Unfortunately, we encountered issues downloading files from these older sites due to errors. However, we found a repository under the MIT License for JMDict (used for Yomitan) that is frequently updated. You can check it out [here](https://github.com/scriptin/jmdict-simplified).

We downloaded the JMDict file from that repository, which does not include example sentences from Tatoeba. In the future, we may download the larger file as well.

**Licence (JMDict for Yomitan)**  
The code in the JMDict for Yomitan repository is licensed under the MIT License. The released dictionaries are licensed under the Creative Commons Attribution-ShareAlike Licence (V4.0), the same as JMdict.

---

### Radicals + KRADFILE
The meanings of the radicals used in our project are sourced from [Wikipedia](https://en.wikipedia.org/wiki/Kangxi_radical). You can view the full list of kanji radicals by stroke count [here](https://en.wikipedia.org/wiki/List_of_kanji_radicals_by_stroke_count).

**KRADFILE**  
We are using the KRADFILE for our project. More information about KRADFILE can be found [here](http://www.edrdg.org/krad/kradinf.html).

The RADKFILE and KRADFILE files are copyrighted and available under the [EDRDG Licence](http://www.edrdg.org/edrdg/licence.html). The copyright for RADKFILE2 and KRADFILE2 is held by Jim Rose. However, we are only using KRADFILE (not KRADFILE2), so we are in compliance with the licence.

For more information on the EDRDG licence, you can visit [this link](http://www.edrdg.org/edrdg/licence.html).

Sample attribution texts for using these files under the licence can be found [here](http://www.edrdg.org/edrdg/licence.html#attribution).

---

### JAMDICT
JAMDICT is a Python package for working with Japanese dictionary files. It is licensed under the MIT License.

For more information, you can visit the package page on PyPI [here](https://pypi.org/project/jamdict/).

The source code and additional details can be found on GitHub [here](https://github.com/neocl/jamdict).

---

### Kanji Radicals
List of Kanji Radicals sourced from [Wikipedia](https://en.wikipedia.org/wiki/List_of_kanji_radicals).

---

**Pictures are taken from [unsplash.com](https://unsplash.com).**


