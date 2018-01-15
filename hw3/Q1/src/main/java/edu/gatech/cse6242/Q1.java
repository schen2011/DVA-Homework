package edu.gatech.cse6242;

import java.io.IOException;

import org.apache.hadoop.fs.Path;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.io.*;
import org.apache.hadoop.mapreduce.*;
import org.apache.hadoop.util.*;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;

public class Q1 {

  public static void main(String[] args) throws Exception {
    Configuration conf = new Configuration();
    Job job = Job.getInstance(conf, "Q1");

    /* TODO: Needs to be implemented */

    //set this class to Jar
    job.setJarByClass(Q1.class);

	  //assgin the two class designed as the class to process job
    job.setMapperClass(TempMapper.class);
    job.setReducerClass(TempReducer.class);

    //set up the class of key and value in output file
    job.setOutputKeyClass(IntWritable.class);
    job.setOutputValueClass(IntWritable.class);

    FileInputFormat.addInputPath(job, new Path(args[0]));
    FileOutputFormat.setOutputPath(job, new Path(args[1]));
    System.exit(job.waitForCompletion(true) ? 0 : 1);
  }

  static class TempMapper extends
  			Mapper<LongWritable, Text, IntWritable, IntWritable>{
  		@Override
  		public void map(LongWritable key, Text value, Context context)
  				throws IOException, InterruptedException{
  					//split each line of data
  					String dataStr = value.toString();
  					String[] data = dataStr.split("\t");

  					//extract the target and weight
  					IntWritable target = new IntWritable(Integer.parseInt(data[1]));
  					IntWritable weight = new IntWritable(Integer.parseInt(data[2]));

  					//write into Mapper output
  					context.write(target, weight);
  				}
  			}

  static class TempReducer extends
  			Reducer<IntWritable,IntWritable,IntWritable,IntWritable>{
  		@Override
  		public void reduce(IntWritable key, Iterable<IntWritable> values, Context context) 
  				throws IOException, InterruptedException{
  					//intital the min
  					int min = Integer.MAX_VALUE;

  					//find the minimum value
  					for(IntWritable value: values)
  						min = Math.min(min, value.get());
  					
  					//write into Reducer output
  					context.write(key, new IntWritable(min));
  				}
  		}
}

