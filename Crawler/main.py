import crawl
import os
import time
import json


def writeFile(name, serial, content):
    file_name = name + '_' + serial + '.txt'
    file = open(os.path.join('data', file_name), 'w')
    file.write(content[1])

    file.close()

    return file_name


def writeInfo(serial, info):
    file_name = 'info' + '_' + serial + '.json'
    file = open(os.path.join('data', file_name), 'w')
    file.write(json.dumps(info, ensure_ascii=False))
    file.close()


if __name__ == "__main__":
    start = time.time()
    press_no = {'중앙': '025', 'JTBC': '437', 'YTN': '052', '연합': '001', 'SBS': '055',
                'KBS': '056', 'MBC': '214', '한겨레': '028', '경향': '032', '조선': '023'}
    files = {}

    links = crawl.linksOfPress(press_no)
    print("|" * 200)

    for key, value in links.items():
        for e in value:
            fileInfo = {}
            now = str(time.time())
            crawled = crawl.parseNews(crawl.makeHTML(e[1], {}))
            file_name = writeFile(key, now, crawled)

            fileInfo['title'] = e[0]
            fileInfo['url'] = e[1]
            files[file_name] = fileInfo

            print("|", end='')

    writeInfo(time.strftime('%Y%m%d%H%M%S', time.localtime(time.time())), files)
    print('\n\n경과 시간 : ', end='')
    print(time.time()-start)