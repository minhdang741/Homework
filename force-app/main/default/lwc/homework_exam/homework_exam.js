import { LightningElement, track } from 'lwc';
import getData from '@salesforce/apex/homework_ExamController.getData';

export default class Homework_exam extends LightningElement {
    @track questions = [
        // {"Id": "1", "IsQuiz":true, "Question":"This is first question", "A":{"Id":"1.1", "Value":"This is answer"}, "B":{"Id":"1.2", "Value":"This is answer"}, "C":{"Id":"1.3", "Value":"This is answer"}, "D":{"Id":"1.4", "Value":"This is answer"}, "Answer":""},
        // {"Id": "2", "IsQuiz":true, "Question":"This is second question", "A":{"Id":"2.1", "Value":"This is answer"}, "B":{"Id":"2.2", "Value":"This is answer"}, "C":{"Id":"2.3", "Value":"This is answer"}, "D":{"Id":"2.4", "Value":"This is answer"}, "Answer":""},
        // {"Id": "3", "IsQuiz":false, "Question":"This is third question", "Answer":""},
        // {"Id": "2", "Question":"This is second question", "Answer":[{"Id":"a2", "Value":"This is answer"}, {"Id":"b2", "Value":"This is answer"}, {"Id":"c2", "Value":"This is answer"}, {"Id":"d2", "Value":"This is answer"}]},
        // {"Id": "2", "Question":"This is second question", "a":"This is answer", "b":"his is answer", "c":"his is answer", "d":"his is answer"}
    ];
    subjectType = 'Math';
    questionType = 'Practice';
    grade = '3';

    connectedCallback() {
        getData({subjectType:this.subjectType, questionType:this.questionType, grade:this.grade})
        .then(result => {
            this.questions = result;
        })
        .catch(error => {
            console.log('Cannot getData due to: ', error);
        });
    }
}