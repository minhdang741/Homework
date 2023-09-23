import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// Import controller
import getData from '@salesforce/apex/homework_ExamController.getData';
import login from '@salesforce/apex/homework_ExamController.login';
import getAllSubject from '@salesforce/apex/homework_ExamController.getAllSubject';
import submit from '@salesforce/apex/homework_ExamController.submit';

export default class Homework_exam extends LightningElement {
    questions = [];
    answers = {};
    examTypes = [
        {id:"1", label:"Practice", value:"Practice"},
        {id:"2", label:"Exam", value:"Exam"}
    ];
    subjects = [];
    isLogin = false;
    studentInfo = {};
    isLoading = false;
    isSubmit = false;

    connectedCallback() {
        getAllSubject()
        .then(result => {
            this.subjects = result
        })
        .catch(error => {
            console.log("Cannot get subjects due to: " + error?.body?.message);
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
        this.isLoading = true;
        let username = this.template.querySelector('input[name="username"]').value;
        let password = this.template.querySelector('input[name="password"]').value;
        let type = this.template.querySelector('select[name="examType"]').value;
        let subject = this.template.querySelector('select[name="subject"]').value;
        // Handle login
        login({username:username, password:password})
        .then(result => {
            this.isLoading = false;
            // If login successfully
            if(result) {
                this.isLoading = true;
                this.studentInfo = result;
                this.isLogin = true;
                console.log(this.studentInfo);
                // Get exam
                getData({subjectType:subject, questionType:type, grade:this.studentInfo.Grade__c})
                .then(result => {
                    console.log(result);
                    this.questions = result;
                    // Generate answer
                    for(let i = 0; i < this.questions.length; i++) {
                        this.answers[this.questions[i].id] = '';
                    }
                    this.isLoading = false;
                })
                .catch(error => {
                    this.isLoading = false;
                    console.log('Cannot getData due to: ', error?.body?.message);
                });
            }
        })
        .catch(error => {
            this.isLoading = false;
            console.log("cannot login due to: " + error?.body?.message);
        });
    }

    handleSubmit() {
        this.isLoading = true;
        console.log('answers: ' + JSON.stringify(this.answers));
        submit({answers: JSON.stringify(this.answers), studentId: this.studentInfo.Id})
        .then(result => {
            console.log(result);
            this.isLoading = false;
            this.isSubmit = true;
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Submit successfully',
                    message: 'Thanks for taking exam.',
                    variant: 'success',
                }),
            );
        })
        .catch(error => {
            this.isLoading = false;
            console.log('Cannot submit due to: ' + error?.body?.message);
        });
    }

    backToLogin() {
        this.isLogin = false;
    }
}