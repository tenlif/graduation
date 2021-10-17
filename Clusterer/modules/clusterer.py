import os
import pandas as pd
import findspark

findspark.init()

from pyspark import SparkConf, SparkContext
from pyspark.sql import SQLContext, Row, SparkSession
from pyspark.ml.feature import CountVectorizer, HashingTF, Normalizer, IDF
from pyspark.mllib.linalg import Vector, Vectors
from pyspark.ml import Pipeline
from pyspark.ml.clustering import KMeans
from pyspark.sql.functions import split, col

from collections import Counter

def cluster(path):
    file_list = os.listdir(path)
    file_list_py = [file for file in file_list if file.endswith('_token.txt')]

    txts = {}

    for e in file_list_py:
        file = open(os.path.join(path, e), 'r')
        buffer = file.readline()
        txts[e.rstrip('_token.txt')] = buffer

    df = pd.DataFrame.from_dict(txts, orient='index')
    df = df.reset_index()
    df.columns = ['file_name', 'texts']

    spark = SparkSession.builder \
        .master("local[1]") \
        .appName("tfidf") \
        .getOrCreate()
    sparkDF = spark.createDataFrame(df)

    wordsSplit = sparkDF.select(col("file_name"), split(col("texts"), " ").alias("textArray")) \
        .drop("texts")

    ### TF
    hashingTF = HashingTF(inputCol="textArray", outputCol="hashingTF")
    featurizedDataDF = hashingTF.transform(wordsSplit)

    ### IDF
    idf = IDF(inputCol="hashingTF", outputCol="idf")
    idfModel = idf.fit(featurizedDataDF)

    ### Normalize
    normalizer = Normalizer(inputCol="idf", outputCol="features")

    ### Kmeans
    kmeans = KMeans(featuresCol="features", predictionCol="prediction", k=10)

    ### Pipeline
    pipeline = Pipeline(stages=[hashingTF, idf, normalizer, kmeans])
    model = pipeline.fit(wordsSplit)

    ### Prediction
    prediction = model.transform(wordsSplit)

    predictionPD = prediction.toPandas()

    for i in predictionPD.groupby(predictionPD['prediction']).textArray:
        counter = Counter([])
        for j in i[1]:
            counter.update(j)
        print(counter.most_common(n=5))