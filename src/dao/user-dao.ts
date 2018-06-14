import aws from 'aws-sdk';
import {ConfigurationOptions} from 'aws-sdk/lib/config';
const awsConfig: ConfigurationOptions = {
  region: 'us-east-2',
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
}

aws.config.update(awsConfig);

const dynamodb = new aws.DynamoDB();
const docClient = new aws.DynamoDB.DocumentClient(); // subset of functionality of dynamodb

//Create User Table
export function createUserTable() {
  dynamodb.createTable({
    TableName: 'user',
    KeySchema: [
      {AttributeName: 'username', KeyType: 'HASH'},
      {AttributeName: 'timestamp', KeyType: 'RANGE'}
    ],
    AttributeDefinitions: [
      {AttributeName: 'username', AttributeType: 'S'},
      {AttributeName: 'timestamp', AttributeType: 'S'}
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 2,
      WriteCapacityUnits: 2
    }
  }, (err, data) => {
    if(err) {
      console.log(`Unable to create table: \n ${JSON.stringify(err, undefined, 2)}`);
    } else {
      console.log(`Created table: \n ${JSON.stringify(data, undefined, 2)}`);
    }
  });
}


//Create Account

export function createAccount(){

}

//Add to user Table (Account creating)
export function saveUser(user): Promise<any> {
  return docClient.put({
    TableName: 'user',
    Item: user
  }).promise();
}

//Find a user
export function findByUser(user: string): Promise<any> {
  return docClient.query({
    TableName: 'user',
    KeyConditionExpression: '#yr = :yyyy',
    ExpressionAttributeNames: { // for aliasing field names
      '#yr': 'username'
    },
    ExpressionAttributeValues: { // for aliasing actual values
      ':yyyy': user
    },
    // ReturnConsumedCapacity: 'TOTAL' // not needed but if you want to see this info it is there
    
  }).promise();
}

//Get all users
export function findAllUser(): Promise<any> {
  return docClient.scan({
    TableName: 'user'
  }).promise();
}


export function findByYearAndTitle(year: number, title: string): Promise<any> {
  return docClient.get({
    TableName: 'movies',
    Key: {
      year: year,
      title: title
    }
  }).promise();
}

