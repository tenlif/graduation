from collections import Counter
import pandas as pd
import json
import os
from pymongo import MongoClient


def getKeywords(df):
    keywords = []
    for i in df.groupby(df['prediction']).textArray:
        counter = Counter([])
        for j in i[1]:
            counter.update(j)
        word_most = []
        for word in counter.most_common(n=5):
            word_most.append(word[0])

        keywords.append(','.join(word_most))

    return keywords


def openJson(dir):
    path = os.path.join('data', dir)
    with open(os.path.join(path, 'info_' + dir + '.json')) as f:
        info = json.load(f)

    return info


def save_mongo(dir, df):
    mongo_data = {}
    clusters = []

    info = openJson(dir)
    keywords = getKeywords(df)

    for index, i in enumerate(df.groupby(df['prediction']).file_name):
        new_dict = {}
        new_arr = []
        for j in i[1]:
            news_info = info[j + '.txt']
            news_info['press'] = j.split('_')[0]
            new_arr.append(news_info)
        new_dict['keywords'] = keywords[index]
        new_dict['news'] = new_arr
        clusters.append(new_dict)

    mongo_data['time'] = dir
    mongo_data['clusters'] = clusters

    client = MongoClient('localhost', 27017)
    db = client['mydb']

    posts = db.news
    post_id = posts.insert_one(mongo_data).inserted_id

    return post_id