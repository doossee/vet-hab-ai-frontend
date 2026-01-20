module.exports = {
    'main': {
        input: './src/shared/schema/schema.yaml',
        output: {
            target: './src/shared/api/index.ts',
            prettier: true,
            override: {
                mutator: {
                    path: './src/shared/api/api-instance.ts',
                    name: 'createInstance',
                }
            }
        }
    },
}