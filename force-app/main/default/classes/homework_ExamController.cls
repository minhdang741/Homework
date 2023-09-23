public with sharing class homework_ExamController {
    @AuraEnabled
    public static List<QuestionWrapper> getData(String subjectType, String questionType, String grade) {
        // Get questions base on subject and student information
        Subject__c subject = [SELECT Id FROM Subject__c WHERE Type__c = :subjectType AND Grade__c = :grade];
        List<Question__c> questions = [
            SELECT Id, Question__c, Type__c, A__c, B__c, C__c, D__c, Correct_Answer__c, Subject__c 
            FROM Question__c 
            WHERE Type__c = :questionType AND Subject__c = :subject.Id
        ];

        // Wrap questions
        List<QuestionWrapper> listQuestionWrapper = new List<QuestionWrapper>();
        for(Question__c question : questions) {
            QuestionWrapper questionWrap = new QuestionWrapper(listQuestionWrapper.size() + 1, question);
            listQuestionWrapper.add(questionWrap);
        }
        
        return listQuestionWrapper;
    }

    @AuraEnabled
    public static Student__c login(String username, String password) {
        Student__c student = [SELECT Id, Grade__c FROM Student__c WHERE Name = :username AND Password__c = :password LIMIT 1];
        return student;
    }
    @AuraEnabled
    public static List<SubjectWrapper> getAllSubject() {
        List<Subject__c> allSubjects = [SELECT Id, Type__c FROM Subject__c ORDER BY Type__c ASC];
        List<SubjectWrapper> listSubjectWrapper = new List<SubjectWrapper>();
        for(Subject__c subject : allSubjects) {
            SubjectWrapper subjectWrap = new SubjectWrapper(listSubjectWrapper.size(), subject);
            listSubjectWrapper.add(subjectWrap);
        }
        return listSubjectWrapper;
    }

    @AuraEnabled
    public static String submit(String answers, String studentId) {
        Map<String,String> mapAnswers = (Map<String,String>) JSON.deserialize(answers, Map<String,String>.class);
        System.debug(mapAnswers);
        Datetime submitDate = Datetime.now();
        List<Student_Answer__c> listAnswers = new List<Student_Answer__c>();
        for(String quesId : mapAnswers.keySet()) {
            Student_Answer__c studentAnswer = new Student_Answer__c();
            studentAnswer.Student__c = studentId;
            studentAnswer.Question__c = quesId;
            studentAnswer.Answer__c = mapAnswers.get(quesId);
            studentAnswer.Submit_Date__c = submitDate;
            listAnswers.add(studentAnswer);
        }
        Savepoint sp = Database.setSavepoint();
        try {
            insert listAnswers;
            return 'Submit sucessfully';
        } catch (DmlException e) {
            Database.rollback(sp);
            System.debug('Submit error --> ' + e);
            throw new AuraHandledException(e.getMessage());
        }
    }

    public class SubjectWrapper {
        @AuraEnabled public Integer id {get; set;}
        @AuraEnabled public String value {get; set;}
        @AuraEnabled public String label {get; set;}

        // Format subject
        public SubjectWrapper(Integer index, Subject__c subject) {
            this.id = index;
            this.value = subject.Type__c;
            this.label = subject.Type__c;
        }
    }

    public class QuestionWrapper {
        @AuraEnabled public String id {get; set;}
        @AuraEnabled public Integer index {get; set;}
        @AuraEnabled public Boolean isQuiz {get; set;}
        @AuraEnabled public String question {get; set;}
        @AuraEnabled public ChoiceWrapper A {get; set;}
        @AuraEnabled public ChoiceWrapper B {get; set;}
        @AuraEnabled public ChoiceWrapper C {get; set;}
        @AuraEnabled public ChoiceWrapper D {get; set;}
        @AuraEnabled public String answer {get; set;}
        
        // Format question
        public QuestionWrapper(Integer index, Question__c question) {
            this.id = question.Id;
            this.index = index;
            this.isQuiz = String.isBlank(question.A__c) ? false : true;
            this.question = question.Question__c;
            this.A = new ChoiceWrapper(id, question.A__c, 'A');
            this.B = new ChoiceWrapper(id, question.B__c, 'B');
            this.C = new ChoiceWrapper(id, question.C__c, 'C');
            this.D = new ChoiceWrapper(id, question.D__c, 'D');
            this.answer = '';
        }
    }

    public class ChoiceWrapper {
        @AuraEnabled public String id {get; set;}
        @AuraEnabled public String value {get; set;}

        // Format choice
        public ChoiceWrapper(String questionId, String value, String choice) {
            this.id = String.format('{0}.{1}', new List<String>{questionId, choice});
            this.value = value;
        }
    }
}