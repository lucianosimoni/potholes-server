export default function serverAddress() {
  if (process.env.RUNNING_ENVIRONMENT == "production") {
    return "http://localhost:3000";
  } else return "http://localhost:3000";
}
