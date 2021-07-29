var flowFile = session.get();

if (flowFile !== null) {

  var StreamCallback = Java.type("org.apache.nifi.processor.io.StreamCallback");
  var IOUtils = Java.type("org.apache.commons.io.IOUtils");
  var StandardCharsets = Java.type("java.nio.charset.StandardCharsets");

  flowFile = session.write(flowFile, new StreamCallback(function (inputStream, outputStream) {
    // Read input FlowFile content
    var inputText = IOUtils.toString(inputStream, StandardCharsets.UTF_8);
    var inputObj = JSON.parse(inputText);

    var outputObj = {
      electricity: parseFloat(inputObj.electricity),
      furnace: parseFloat(inputObj.furnace),
      entrance: parseFloat(inputObj.entrance),
      exit: parseFloat(inputObj.exit),
      exhaust: parseFloat(inputObj.exhaust),
      e103: parseFloat(inputObj.e103),
      e106: parseFloat(inputObj.e106),
      e108: parseFloat(inputObj.e108),
      create_time: (new Date()).getTime()
    };
    // Write output content
    outputStream.write(JSON.stringify(outputObj, null, "\t").getBytes(StandardCharsets.UTF_8));
  }));

  // Finish by transferring the FlowFile to an output relationship
  session.transfer(flowFile, REL_SUCCESS);
}