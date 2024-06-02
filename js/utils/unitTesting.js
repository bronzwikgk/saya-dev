class unitTest {
    constructor(classCode, exampleCode) {
        this.classCode = classCode;
        this.exampleCode = exampleCode;
        this.history = [];
    }

    async isCodeErrorFree() {
        const completeCode = `${this.classCode}\n${this.exampleCode}`;
        try {
          await eval(completeCode);
          return { status: 'success', mes: 'Code executed without errors' };
        } catch (error) {
          return { status: 'failed', mes: { errorLog: error.stack, errorMessage: error.message, errorLineNumber: error.lineNumber } };
        }
    }

    isFunctionEmpty() {
        const emptyFunctions = [];
        const functionMatches = this.classCode.match(/(\w+)\s*\(.*\)\s*\{/g);
        console.log(functionMatches)
        if (functionMatches) {
          functionMatches.forEach(func => {
            const funcBody = func.match(/{([\s\S]*)}$/);
            if (funcBody && !funcBody[1].trim()) {
              emptyFunctions.push(func.match(/(\w+)\s*/)[1]);
            }
          });
        }
        return emptyFunctions;
    }
    /*
    async generateUnitTestCases(functionName) {
        const OPENAI_API_KEY = 'your open ai key';
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: this.classCode + 'generate a array of objects contain "in" and "out" property  for '+functionName+'   "in" is also array contain data according to parameter . "out" is the output of function according to you . only generate the array of object in json form ' }
            ]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + OPENAI_API_KEY
            }
        });
        const content = response.data.choices[0].message.content;
        const javascriptContent = content.substring(content.indexOf('```json')+7, content.lastIndexOf('```'));
        console.log(javascriptContent);
        return JSON.parse(javascriptContent);
    }
    */
    async unitTest(functionName,testCases) {
        const results = { testSuccess: 0, testFailed: 0, testError: 0, success: [], failed: [], error: [] };
    
        for (const testCase of testCases) {
          try {
            const instanceCode = `const instance = new ${this.classCode.match(/class\s+(\w+)/)[1]}();`;
            const functionCallCode = `instance.${functionName}("${testCase.in.join('","')}");`;
            const output = eval(`${this.classCode}\n${instanceCode}\n${functionCallCode}`);
            console.log(output);
            if (JSON.stringify(output) === JSON.stringify(testCase.out)) {
              results.testSuccess++;
              results.success.push(testCase);
            } else {
              results.testFailed++;
              results.failed.push(testCase);
            }
          } catch (error) {
            results.testError++;
            results.error.push({ testCase, error });
          }
        }
        
        const totalTests = results.testSuccess + results.testFailed + results.testError;
        results.percentageSuccess = results.testSuccess / totalTests;
        results.percentageFailed = results.testFailed / totalTests;
        results.percentageError = results.testError / totalTests;
        
        return results;
    }

    async generateIntegratedTestCases() {
        
    }

    async integrationTesting() {
        
    }
}

export {unitTest}