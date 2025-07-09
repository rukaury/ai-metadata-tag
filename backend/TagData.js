export default class TagData {
    constructor(tagName, startTime, endTime, confidence) {
        this.tagName = tagName;
        this.startTime = startTime;
        this.endTime = endTime;
        this.confidence = confidence;
    }
}