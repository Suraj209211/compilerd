const { expect } = require('chai')
const { isValidForExecute } = require('./code.validator')

describe('Validation Tests', () => {
    it('should validate a valid body for JAVA language', async () => {
        const body = {
            language: 'java',
            script: 'public class Main { public static void main(String[] args) { System.out.println("Hello World"); } }'
        }

        try {
            const result = await isValidForExecute(body)
            expect(result).to.deep.equal(body)
        } catch (err) {
            expect.fail('Validation should have passed')
        }
    })

    it('should invalidate a body with missing script for JAVA language', async () => {
        const body = {
            language: 'java'
        }

        try {
            await isValidForExecute(body)
            expect.fail('Validation should have failed')
        } catch (err) {
            expect(err.details[0].message).to.equal('"script" is required')
        }
    })

    it('should validate a valid body for Python language', async () => {
        const body = {
            language: 'python',
            script: 'print("Hello World")'
        }

        try {
            const result = await isValidForExecute(body)
            expect(result).to.deep.equal(body)
        } catch (err) {
            expect.fail('Validation should have passed')
        }
    })

    it('should invalidate a body with missing script for Python language', async () => {
        const body = {
            language: 'python'
        }

        try {
            await isValidForExecute(body)
            expect.fail('Validation should have failed')
        } catch (err) {
            expect(err.details[0].message).to.equal('"script" is required')
        }
    })

    it('should handle unsupported language gracefully', async () => {
        const body = {
            language: 'ruby',
            script: 'puts "Hello World"'
        }

        try {
            await isValidForExecute(body)
            expect.fail('Validation should have failed')
        } catch (err) {
            expect(err.message).to.equal('Unsupported language: ruby')
        }
    })

    it('should handle empty script gracefully', async () => {
        const body = {
            language: 'java',
            script: ''
        }

        try {
            await isValidForExecute(body)
            expect.fail('Validation should have failed')
        } catch (err) {
            expect(err.details[0].message).to.equal('"script" is not allowed to be empty')
        }
    })

    it('should handle malformed script gracefully', async () => {
        const body = {
            language: 'python',
            script: 'print("Hello World"'
        }

        try {
            await isValidForExecute(body)
            expect.fail('Validation should have failed')
        } catch (err) {
            expect(err.details[0].message).to.include('SyntaxError')
        }
    })

    it('should handle additional unknown properties in body', async () => {
        const body = {
            language: 'java',
            script: 'public class Main { public static void main(String[] args) { System.out.println("Hello World"); } }',
            extraParam: 'additional'
        }

        try {
            const result = await isValidForExecute(body)
            expect(result).to.not.have.property('extraParam')
        } catch (err) {
            expect.fail('Validation should have passed')
        }
    })

    it('should handle case sensitivity in language field', async () => {
        const body = {
            language: 'PYTHON',
            script: 'print("Hello World")'
        }

        try {
            const result = await isValidForExecute(body)
            expect(result.language).to.equal('python')
        } catch (err) {
            expect.fail('Validation should have passed')
        }
    })

    it('should handle edge case with very large script size', async () => {
        const largeScript = 'a'.repeat(10_000_000) // Create a script with 10 million characters
        const body = {
            language: 'python',
            script: largeScript
        }

        try {
            const result = await isValidForExecute(body)
            expect(result).to.deep.equal(body)
        } catch (err) {
            expect.fail('Validation should have passed')
        }
    })

    it('should handle scripts with non-ASCII characters', async () => {
        const body = {
            language: 'java',
            script: 'public class Main { public static void main(String[] args) { System.out.println("こんにちは、世界"); } }'
        }

        try {
            const result = await isValidForExecute(body)
            expect(result).to.deep.equal(body)
        } catch (err) {
            expect.fail('Validation should have passed')
        }
    })

    it('should handle special characters in script', async () => {
        const body = {
            language: 'python',
            script: 'print("!@#$%^&*()_+-=[]{}|;:\',./<>?`~")'
        }

        try {
            const result = await isValidForExecute(body)
            expect(result).to.deep.equal(body)
        } catch (err) {
            expect.fail('Validation should have passed')
        }
    })

    it('should handle concurrent requests without errors', async () => {
        const requests = [
            { language: 'java', script: 'public class Main { public static void main(String[] args) { System.out.println("Request 1"); } }' },
            { language: 'python', script: 'print("Request 2")' },
            { language: 'javascript', script: 'console.log("Request 3");' }
        ]

        const results = await Promise.all(requests.map(isValidForExecute))

        results.forEach((result, index) => {
            expect(result).to.deep.equal(requests[index])
        })
    })

    it('should handle scripts with comments', async () => {
        const body = {
            language: 'javascript',
            script: `
                // This is a comment
                /* 
                    Multi-line comment 
                */
                console.log("Hello World");
            `
        }

        try {
            const result = await isValidForExecute(body)
            expect(result).to.deep.equal(body)
        } catch (err) {
            expect.fail('Validation should have passed')
        }
    })

    it('should handle scripts with external dependencies', async () => {
        const body = {
            language: 'javascript',
            script: `
                const axios = require('axios');
                async function fetchData() {
                    const response = await axios.get('https://jsonplaceholder.typicode.com/todos/1');
                    console.log(response.data);
                }
                fetchData();
            `
        }

        try {
            const result = await isValidForExecute(body)
            expect(result).to.deep.equal(body)
        } catch (err) {
            expect.fail('Validation should have passed')
        }
    })

    // Add more test cases for different scenarios
})

