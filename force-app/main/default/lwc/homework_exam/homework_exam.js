import { LightningElement, track } from 'lwc';
import getData from '@salesforce/apex/homework_ExamController.getData';
import login from '@salesforce/apex/homework_ExamController.login';
import getAllSubject from '@salesforce/apex/homework_ExamController.getAllSubject';

export default class Homework_exam extends LightningElement {
    questions = [
        // {"Id": "1", "IsQuiz":true, "Question":"This is first question", "A":{"Id":"1.1", "Value":"This is answer"}, "B":{"Id":"1.2", "Value":"This is answer"}, "C":{"Id":"1.3", "Value":"This is answer"}, "D":{"Id":"1.4", "Value":"This is answer"}, "Answer":""},
        // {"Id": "2", "IsQuiz":true, "Question":"This is second question", "A":{"Id":"2.1", "Value":"This is answer"}, "B":{"Id":"2.2", "Value":"This is answer"}, "C":{"Id":"2.3", "Value":"This is answer"}, "D":{"Id":"2.4", "Value":"This is answer"}, "Answer":""},
        // {"Id": "3", "IsQuiz":false, "Question":"This is third question", "Answer":""},
        // {"Id": "2", "Question":"This is second question", "Answer":[{"Id":"a2", "Value":"This is answer"}, {"Id":"b2", "Value":"This is answer"}, {"Id":"c2", "Value":"This is answer"}, {"Id":"d2", "Value":"This is answer"}]},
        // {"Id": "2", "Question":"This is second question", "a":"This is answer", "b":"his is answer", "c":"his is answer", "d":"his is answer"}
    ];
    answers = {};
    examTypes = [
        {id:"1", label:"Practice", value:"Practice"},
        {id:"2", label:"Exam", value:"Exam"}
    ];
    subjects = [
        // {id:"1", label:"Math", value:"Math"},
        // {id:"2", label:"Literature", value:"Literature"}
    ];
    isLogin = false;

    connectedCallback() {
        getAllSubject()
        .then(result => {
            this.subjects = result
        })
        .catch(error => {
            console.log("Cannot get subjects due to: " + error?.message?.body);
        });
    }

    handleQuizChoice(event) {
        let choice = event.target.value;
        let questionId = event.target.name;
        this.answers[questionId] = choice;
        console.log(this.answer);
    }

    handleWrittingAnswer(event) {
        let questionId = event.target.name;
        let answer = event.target.value;
        this.answers[questionId] = answer;
    }

    selectExamType(event) {
        this.type = event.detail.value;
    }

    handleLogin() {
        let username = this.template.querySelector('input[name="username"]').value;
        let password = this.template.querySelector('input[name="password"]').value;
        let type = this.template.querySelector('select[name="examType"]').value;
        let subject = this.template.querySelector('select[name="subject"]').value;
        // Handle login
        login({username:username, password:password})
        .then(result => {
            // If login successfully
            if(result) {
                let student = result;
                this.isLogin = true
                console.log(student);
                // Get exam
                getData({subjectType:subject, questionType:type, grade:student.Grade__c})
                .then(result => {
                    console.log(result);
                    this.questions = result;
                })
                .catch(error => {
                    console.log('Cannot getData due to: ', error?.message?.body);
                });
            }
        })
        .catch(error => {
            console.log("cannot login due to: " + error?.message?.body);
        });
    }
}