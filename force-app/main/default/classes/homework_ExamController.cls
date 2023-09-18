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
            QuestionWrapper questionWrap = new QuestionWrapper(listQuestionWrapper.size(), question);
            listQuestionWrapper.add(questionWrap);
        }
        
        return listQuestionWrapper;
    }

    public class QuestionWrapper {
        @AuraEnabled public String Id {get; set;}
        @AuraEnabled public Integer Index {get; set;}
        @AuraEnabled public Boolean IsQuiz {get; set;}
        @AuraEnabled public String Question {get; set;}
        @AuraEnabled public ChoiceWrapper A {get; set;}
        @AuraEnabled public ChoiceWrapper B {get; set;}
        @AuraEnabled public ChoiceWrapper C {get; set;}
        @AuraEnabled public ChoiceWrapper D {get; set;}
        @AuraEnabled public String Answer {get; set;}
        
        // Format question
        public QuestionWrapper(Integer index, Question__c question) {
            this.Id = question.Id;
            this.Index = index;
            this.IsQuiz = String.isBlank(question.A__c) ? false : true;
            this.Question = question.Question__c;
            this.A = new ChoiceWrapper(Id, question.A__c, 'A');
            this.B = new ChoiceWrapper(Id, question.B__c, 'B');
            this.C = new ChoiceWrapper(Id, question.C__c, 'C');
            this.D = new ChoiceWrapper(Id, question.D__c, 'D');
            this.Answer = '';
        }
    }

    public class ChoiceWrapper {
        @AuraEnabled public String Id {get; set;}
        @AuraEnabled public String Value {get; set;}

        // Format choice
        public ChoiceWrapper(String questionId, String value, String choice) {
            this.Id = String.format('{0}.{1}', new List<String>{questionId, choice});
            this.Value = value;
        }
    }
}