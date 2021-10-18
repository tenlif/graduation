from modules import crawl
from modules import tokenize_nlp
from modules import clusterer
from modules import savedb
import time
import os


if __name__ == "__main__":
    start = time.time()
    strfstart = time.strftime('%Y%m%d%H%M%S', time.localtime(time.time()))
    directory = os.path.join('data', strfstart)
    press_no = {'중앙': '025', 'JTBC': '437', 'YTN': '052', '연합': '001', 'SBS': '055',
                'KBS': '056', 'MBC': '214', '한겨레': '028', '경향': '032', '조선': '023'}
    files = {}
    links = crawl.linksOfPress(press_no)

    for key, value in links.items():
        for e in value:
            fileInfo = {}
            now = str(time.time())
            crawled = crawl.parseNews(crawl.makeHTML(e[1], {}))
            file_name = crawl.writeFile(directory, key, now, crawled)

            fileInfo['title'] = e[0]
            fileInfo['url'] = e[1]
            files[file_name] = fileInfo
        print('|')

    crawl.writeInfo(directory, strfstart, files)
    print('\n\ntime elapsed(until crawl) : ', end='')
    print(time.time()-start)

    sw_file = open('stopwords.txt', 'r')
    stopwords = sw_file.read().split(',')
    for file_name in files.keys():
        tokenize_nlp.tokenize_file(directory, file_name, stopwords)

    df = clusterer.cluster(directory)
    savedb.save_mongo(strfstart, df)