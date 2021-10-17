from konlpy.tag import Mecab
import re
import os
from collections import defaultdict


def clean_text(text):
    text = text.replace("// flash 오류를 우회하기 위한 함수 추가", " ")
    text = text.replace("function _flash_removeCallback() {}", " ")
    text = re.sub('[^\w\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text) #remove extra spaces
    text = re.sub(r'\s+', ' ', text) #remove spaces
    text = re.sub(r"^\s+", '', text) #remove space from start
    text = re.sub(r'\s+$', '', text) #remove space from the end
    text = text.lower()  # lower case

    return text


def pos_text2(text):
    api = Mecab()
    noun = api.nouns(text)

    return noun


def pos_text(text):
    api = KhaiiiApi()
    significant_tags = ['NNG', 'NNP', 'NNB', 'VV', 'VA', 'VX', 'MAG', 'MAJ', 'XSV', 'XSA']

    pos_tagged = ''
    for word in api.analyze(text):
        for morph in word.morphs:
            if morph.tag in significant_tags:
                pos_tagged += morph.lex + '/' + morph.tag + ' '

    return pos_tagged


def stemming_text(text):
    p1 = re.compile('[가-힣A-Za-z0-9]+/NN. [가-힣A-Za-z0-9]+/XS.')
    p2 = re.compile('[가-힣A-Za-z0-9]+/NN. [가-힣A-Za-z0-9]+/XSA [가-힣A-Za-z0-9]+/VX')
    p3 = re.compile('[가-힣A-Za-z0-9]+/VV')
    p4 = re.compile('[가-힣A-Za-z0-9]+/VX')

    ori_sent = text
    mached_terms = re.findall(p1, ori_sent)
    for terms in mached_terms:
        ori_terms = terms
        modi_terms = ''
        for term in terms.split(' '):
            lemma = term.split('/')[0]
            tag = term.split('/')[-1]
            modi_terms += lemma
        modi_terms += '다/VV'
        ori_sent = ori_sent.replace(ori_terms, modi_terms)

    mached_terms = re.findall(p2, ori_sent)
    for terms in mached_terms:
        ori_terms = terms
        modi_terms = ''
        for term in terms.split(' '):
            lemma = term.split('/')[0]
            tag = term.split('/')[-1]
            if tag != 'VX':
                modi_terms += lemma
        modi_terms += '다/VV'
        ori_sent = ori_sent.replace(ori_terms, modi_terms)

    mached_terms = re.findall(p3, ori_sent)
    for terms in mached_terms:
        ori_terms = terms
        modi_terms = ''
        for term in terms.split(' '):
            lemma = term.split('/')[0]
            tag = term.split('/')[-1]
            modi_terms += lemma
        if '다' != modi_terms[-1]:
            modi_terms += '다'
        modi_terms += '/VV'
        ori_sent = ori_sent.replace(ori_terms, modi_terms)

    mached_terms = re.findall(p4, ori_sent)
    for terms in mached_terms:
        ori_terms = terms
        modi_terms = ''
        for term in terms.split(' '):
            lemma = term.split('/')[0]
            tag = term.split('/')[-1]
            modi_terms += lemma
        if '다' != modi_terms[-1]:
            modi_terms += '다'
        modi_terms += '/VV'
        ori_sent = ori_sent.replace(ori_terms, modi_terms)

    return ori_sent


def del_stopwords(text, stopwords):
    words = text
    rt = []
    for word in words:
        if word not in stopwords:
            rt.append(word.split('/')[0])

    return rt


def word_count(words):
    counts = defaultdict(int)
    for word in words:
        counts[word] += 1

    return counts


def tokenize_file(directory, file_name, stopwords):
    file = open(os.path.join(directory, file_name), 'r')
    content = file.read()
    file.close()

    mod_content = clean_text(content)
    # mod_content = pos_text(mod_content)
    # mod_content = stemming_text(mod_content)
    mod_content = pos_text2(mod_content)
    words = del_stopwords(mod_content, stopwords)

    save_file_name = '.'.join(file_name.split('.')[:-1]) + '_token.txt'
    file = open(os.path.join(directory, save_file_name), 'w')
    for word in words:
        file.write(word)
        file.write(' ')
    file.close()