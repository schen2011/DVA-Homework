package edu.gatech.cse6242

import org.apache.spark.SparkContext
import org.apache.spark.SparkContext._
import org.apache.spark.SparkConf
import org.apache.spark.sql.SQLContext
import org.apache.spark.sql.functions._

object Q2 {
	def main(args: Array[String]) {
    	val sc = new SparkContext(new SparkConf().setAppName("Q2"))
		val sqlContext = new SQLContext(sc)
		import sqlContext.implicits._

    	// read the file
    	val file = sc.textFile("hdfs://localhost:8020" + args(0))
		/* TODO: Needs to be implemented */
        
        var file_new = file.map(_.split("\t")).map(line => (line(0).toInt, line(1).toInt, line(2).toInt)).toDF("src", "tgt", "weight").toDF().filter("weight >= 5")

        val source = file_new.select(file_new("src"), -file_new("weight")).toDF("n", "w")
        val target = file_new.select("tgt", "weight").toDF("n", "w")

        val nodes = source.unionAll(target).groupBy("n").agg(Map("w" -> "sum"))
        val res = nodes.rdd.map(line => line(0).toString+"\t"+line(1).toString)

    	// store output on given HDFS path.
    	// YOU NEED TO CHANGE THIS
    	res.saveAsTextFile("hdfs://localhost:8020" + args(1))
  	}
}
