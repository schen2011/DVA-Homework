package edu.gatech.cse6242;

import org.apache.hadoop.fs.Path;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.io.*;
import org.apache.hadoop.mapreduce.*;
import org.apache.hadoop.util.*;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
import java.io.IOException;

public class Q4 {

  public static void main(String[] args) throws Exception {
    Configuration conf1 = new Configuration();

    String interPath = args[1]+"-interPath";

    Job job1 = Job.getInstance(conf1, "Q41");

    //set this class to Jar
    job1.setJarByClass(Q4.class);

    //assgin the two class designed as the class to process job
    job1.setMapperClass(firstMapper.class);
    job1.setReducerClass(totalReducer.class);

    //set up the class of key and value in output file
    job1.setOutputKeyClass(IntWritable.class);
    job1.setOutputValueClass(IntWritable.class);


    FileInputFormat.addInputPath(job1, new Path(args[0]));
    FileOutputFormat.setOutputPath(job1, new Path(interPath));

    //interPath.getFileSystem(conf1).delete(interPath);

    job1.waitForCompletion(true);

    Configuration conf2 = new Configuration();

    Job job = Job.getInstance(conf2, "Q42");
    
    //set this class to Jar
    job.setJarByClass(Q4.class);

    //assgin the two class designed as the class to process job
    job.setMapperClass(secondMapper.class);
    job.setReducerClass(totalReducer.class);

    //set up the class of key and value in output file
    job.setOutputKeyClass(IntWritable.class);
    job.setOutputValueClass(IntWritable.class);

    FileInputFormat.addInputPath(job, new Path(interPath));
    FileOutputFormat.setOutputPath(job, new Path(args[1]));
    
    System.exit(job.waitForCompletion(true)?0:1);
}

  static class firstMapper extends
  			Mapper<LongWritable, Text, IntWritable, IntWritable>{
  		@Override
  		public void map(LongWritable key, Text value, Context context)
  				throws IOException, InterruptedException{
  					//split each line of data
  					String dataStr = value.toString();
            if(dataStr.length()>1){
  					String[] data = dataStr.split("\t");

  					//extract the target and weight
  					IntWritable source = new IntWritable(Integer.parseInt(data[0]));
  					IntWritable target = new IntWritable(Integer.parseInt(data[1]));

  					IntWritable posOne = new IntWritable(1);
  					IntWritable negOne = new IntWritable(-1);

  					//write into Mapper output
  					context.write(source, posOne);
  					context.write(target, negOne);
          	}
  				}
  			}

  static class secondMapper extends
  			Mapper<LongWritable, Text, IntWritable, IntWritable>{
  		@Override
  		public void map(LongWritable key, Text value, Context context)
  				throws IOException, InterruptedException{
  					//split each line of data
  					String dataStr = value.toString();
            if(dataStr.length()>1){
  					String[] data = dataStr.split("\t");

  					//extract the diff and count
  					IntWritable diff = new IntWritable(Integer.parseInt(data[1]));

  					IntWritable posOne = new IntWritable(1);

  					//write into Mapper output
  					context.write(diff, posOne);
  				}
          	}
  			}

  static class totalReducer extends
  			Reducer<IntWritable,IntWritable,IntWritable,IntWritable>{
  		@Override
  		public void reduce(IntWritable key, Iterable<IntWritable> values, Context context) 
  				throws IOException, InterruptedException{
  					//intital the sum
  					int sum = 0;

  					//calculate the sum with the same key
  					for(IntWritable value: values)
  						sum += value.get();

  					//write into Reducer output
  					context.write(key, new IntWritable(sum));
  				}
  		}
}
