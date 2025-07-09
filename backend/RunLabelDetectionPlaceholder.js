import { CreateQueueCommand, GetQueueAttributesCommand, GetQueueUrlCommand, 
  SetQueueAttributesCommand, DeleteQueueCommand, ReceiveMessageCommand, DeleteMessageCommand } from  "@aws-sdk/client-sqs";
import {CreateTopicCommand, SubscribeCommand, DeleteTopicCommand } from "@aws-sdk/client-sns";
import  { SQSClient } from "@aws-sdk/client-sqs";
import  { SNSClient } from "@aws-sdk/client-sns";
import  { RekognitionClient, StartLabelDetectionCommand, GetLabelDetectionCommand } from "@aws-sdk/client-rekognition";
import { stdout } from "process";
import {fromIni} from '@aws-sdk/credential-providers';
import TagData from "./TagData.js";

// Set the AWS Region.
const REGION = "us-east-2";
const profileName = "851725444885_hackathon"
// Create SNS service object.
const sqsClient = new SQSClient({ region: REGION, 
  credentials: fromIni({profile: profileName,}), });
const snsClient = new SNSClient({ region: REGION, 
  credentials: fromIni({profile: profileName,}), });
const rekClient = new RekognitionClient({region: REGION, 
  credentials: fromIni({profile: profileName,}), 
});

// Set bucket and video variables
const bucket = "ai-metadata-tagging-2";
const videoName = "videoplayback.mp4";
const roleArn = "arn:aws:iam::851725444885:role/aws-reserved/sso.amazonaws.com/AWSReservedSSO_hackathon_c658c79ed1229579"
var startJobId = ""

var ts = Date.now();
const snsTopicName = "AmazonRekognitionExample" + ts;
const snsTopicParams = {Name: snsTopicName}
const sqsQueueName = "AmazonRekognitionQueue-" + ts;

// Set the parameters
const sqsParams = {
  QueueName: sqsQueueName, //SQS_QUEUE_URL
  Attributes: {
    DelaySeconds: "60", // Number of seconds delay.
    MessageRetentionPeriod: "86400", // Number of seconds delay.
  },
};

const getLabelDetectionResults = async() => {
  console.log("Retrieving Label Detection results")
  var videoLength = 60;
  var tagDataList = [];

  // Begin retrieving label detection results
  for (let i = 0; i < 5; i++)
  {
    tagDataList.push(new TagData("Tag " + (i+1), i*10, null, 100.00));
  }

  tagDataList = getEndingTimestamps(tagDataList, videoLength);

  return tagDataList;
}

// Generate ending timestamps from next tagData's start time
const getEndingTimestamps = async(tagDataList, videoLength) => {
  var endTimestamp = videoLength;

  for (let i = tagDataList.length - 1; i >= 0; i--)
  {
    tagDataList[i].endTime = endTimestamp;
    endTimestamp = tagDataList[i].startTime;
  }

  return tagDataList;
}

// Start label detection job, sent status notification, check for success status
// Retrieve results if status is "SUCEEDED", delete notification queue and topic
export const runLabelDetectionAndGetResults = async () => {
  const results = await getLabelDetectionResults();
  console.log(results);
  return results;
};

runLabelDetectionAndGetResults()