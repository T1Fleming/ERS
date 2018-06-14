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

//Create Reimbursement Table
export function createReimbursementTable() {
  dynamodb.createTable({
    TableName: 'reimbursement',
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

// export function findByStatus(status: string): Promise<any> {
//   return docClient.scan({
//     TableName: 'reimbursement',
//     ExpressionAttributeValues: { // for aliasing actual values
//       status: status
//     },
//     // ReturnConsumedCapacity: 'TOTAL' // not needed but if you want to see this info it is there
    
//   }).promise();
// }

export function findByStatus(status: string): Promise<any> {
  return docClient.scan({
    TableName: 'reimbursement',
    //ProjectionExpression: '#yr',
    FilterExpression: "#yr=:sta",
    ExpressionAttributeNames: {
        "#yr": "status",
    },
    ExpressionAttributeValues: {
         ":sta": status
    }

    
  }).promise();
}


export function viewPastRequest(){
  
}

export function submitReimbursement(reimbursement): Promise<any> {
  return docClient.put({
    TableName: 'reimbursement',
    Item: reimbursement
  }).promise();
}

export function findReByUser(user: string): Promise<any> {
  return docClient.query({
    TableName: 'reimbursement',
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


export function findReByUserStatus(user: string, status: string): Promise<any> {
  return docClient.query({
    TableName: 'reimbursement',
    KeyConditionExpression: '#yr = :yyyy',
    FilterExpression:  '#s = :xxxx',
    ExpressionAttributeNames: { // for aliasing field names
      '#yr': 'username',
      '#s': 'status'
    },
    ExpressionAttributeValues: { // for aliasing actual values
      ':yyyy': user,
      ':xxxx': status
    },
    // ReturnConsumedCapacity: 'TOTAL' // not needed but if you want to see this info it is there
    
  }).promise();
}




export function findReByUserTime(user: string, time: number): Promise<any> {
  return docClient.get({
    TableName: 'reimbursement',
    Key: {
      username: user,
      timestamp: time
    }
  }).promise();
}

export function updateReByUserTime(user: string, time: number, newStatus: string, approver: string): Promise<any> {
  console.log(user+' '+ time+ ' '+newStatus)
  return docClient.update({

    TableName: 'reimbursement',
    UpdateExpression: "set #a = :q, #b = :r",  
    ExpressionAttributeNames: {
      '#a': 'status',
      '#b': 'approver'
  },
    ExpressionAttributeValues:{
      ':q' : newStatus,
      ':r' : approver
    },
    Key: {
      username: user,
      timestamp: time
    }
  }).promise();
}