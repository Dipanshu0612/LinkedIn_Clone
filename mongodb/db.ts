import mongoose from "mongoose"

const connection=`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASS}@linkedin-clone-dipanshu.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000`

if(!connection){
    throw new Error("Please provide a valid connection!")
}

const connectDB=async ()=>{
    if(mongoose.connection?.readyState>=1){
        console.log("Already connected!");
        return;
    }
    try {
        console.log("Connecting to DB...");
        await mongoose.connect(connection);
    } catch (error) {
        console.log("Error connecting to MongoDB:",error);
    }


}