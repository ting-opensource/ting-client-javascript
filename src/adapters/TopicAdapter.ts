import * as moment from 'moment';
import { extend } from 'lodash';

import { IIncomingTopic, Topic } from '../models/Topic';

export class TopicAdapter
{
    static fromServerResponse(topicData: IIncomingTopic): Topic
    {
        let topic: Topic = new Topic(<IIncomingTopic>extend({}, topicData, {
            createdAt: topicData.createdAt ? moment.utc(topicData.createdAt) : null,
            updatedAt: topicData.updatedAt ? moment.utc(topicData.updatedAt) : null
        }));

        return topic;
    }
}