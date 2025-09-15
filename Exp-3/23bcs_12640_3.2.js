// Base class
class Human {
  constructor(fullName, years) {
    this.fullName = fullName;
    this.years = years;
  }

  introduce() {
    return `Hi, I'm ${this.fullName} and I'm ${this.years} years old.`;
  }
}

// Subclass Learner
class Learner extends Human {
  constructor(fullName, years, classLevel) {
    super(fullName, years);
    this.classLevel = classLevel;
  }

  introduce() {
    return `${super.introduce()} I'm a learner in grade ${this.classLevel}.`;
  }

  study() {
    return `${this.fullName} is studying.`;
  }
}

// Subclass Educator
class Educator extends Human {
  constructor(fullName, years, subjectName) {
    super(fullName, years);
    this.subjectName = subjectName;
  }

  introduce() {
    return `${super.introduce()} I teach ${this.subjectName}.`;
  }

  teach() {
    return `${this.fullName} is teaching ${this.subjectName}.`;
  }
}

// Demonstration
const human = new Human('Alex', 30);
const learner = new Learner('Emily', 20, '12th');
const educator = new Educator('Mr. Smith', 45, 'Mathematics');

console.log(human.introduce());         // Hi, I'm Alex and I'm 30 years old.
console.log(learner.introduce());       // Hi, I'm Emily and I'm 20 years old. I'm a learner in grade 12th.
console.log(learner.study());           // Emily is studying.
console.log(educator.introduce());      // Hi, I'm Mr. Smith and I'm 45 years old. I teach Mathematics.
console.log(educator.teach());          // Mr. Smith is teaching Mathematics.

console.log(learner instanceof Human);   // true
console.log(educator instanceof Learner); // false
