### 크롤링 대상 페이지 url 생성

import os
import requests
from bs4 import BeautifulSoup
import json


def makeHTML(url, params):
    raw = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'}, params=params)

    return raw.text


def makeRankHTML(officeId):  ### 네이버 뉴스 랭킹에서 언론사별 HTML Return
    url = "https://news.naver.com/main/ranking/office.naver"
    params = {
        "officeId": officeId
    }

    return makeHTML(url, params)


def linksFromHTML(html):
    title_link = []

    soup = BeautifulSoup(html, "html.parser")
    ul = soup.select_one("#wrap > div.rankingnews > div.rankingnews_box._officeResult > div > ul")
    lines = ul.select('li > div > a')

    for t in lines:
        title_link.append((t.get_text(), 'https://news.naver.com' + t['href']))

    return title_link


def linksOfPress(press):
    links = {}
    for key, value in press.items():
        link_list = linksFromHTML(makeRankHTML(value))
        links[key] = link_list

    return links


def parseNews(html):
    soup = BeautifulSoup(html, 'html.parser')
    content = soup.select_one("#articleBodyContents").get_text()

    return content



def writeFile(directory, name, serial, content):
    if not os.path.exists(directory):
        os.makedirs(directory)
    file_name = name + '_' + serial + '.txt'
    file = open(os.path.join(directory, file_name), 'w')
    file.write(content)

    file.close()

    return file_name


def writeInfo(directory, serial, info):
    if not os.path.exists(directory):
        os.makedirs(directory)
    file_name = 'info' + '_' + serial + '.json'
    file = open(os.path.join(directory, file_name), 'w')
    file.write(json.dumps(info, ensure_ascii=False))
    file.close()