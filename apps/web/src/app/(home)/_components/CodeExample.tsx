/** eslint-disable react/jsx-no-comment-textnodes */
import React from 'react'

const CodeExample = () => {
  return (
    <div className="max-w-2xl mx-auto mt-8 rounded-lg overflow-hidden bg-slate-900 border border-slate-700">
      <div className="flex items-center px-4 py-2 bg-slate-800">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <span className="ml-4 text-sm text-slate-400">example.ts</span>
      </div>

      <div className="p-4 font-mono text-sm relative">
        <div className="space-y-2">
          <div className="text-slate-400">{"// ❌ Without Type Safety"}</div>
          <div className="text-white">
            function processUser(user) {
              <span className="text-red-400">console.log(user.namee)</span>
            }
          </div>
          <div className="text-red-400 text-xs bg-red-900/30 p-2 rounded">
            Property &apos;namee&apos; does not exist on type &apos;User&apos;.
            Did you mean &apos;name&apos;?
          </div>

          <div className="mt-6 text-slate-400">{"// ✅ With Type Safety"}</div>
          <div>
            <span className="text-blue-400">interface</span>
            <span className="text-green-400"> User</span>
            <span className="text-white"> {'{'}</span>
          </div>
          <div className="pl-4 text-slate-200">
            name: string;
            <br />
            age: number;
          </div>
          <div className="text-white">{'}'}</div>
          <div>
            <span className="text-blue-400">function</span>
            <span className="text-yellow-400"> processUser</span>
            <span className="text-white">(user: </span>
            <span className="text-green-400">User</span>
            <span className="text-white">) {'{'}</span>
          </div>
          <div className="pl-4 text-slate-200">
            console.log(user.name) <span className="text-slate-400">{"// ✨ Type checked!"}</span>
          </div>
          <div className="text-white">{'}'}</div>
        </div>
      </div>
    </div>
  )
}

export default CodeExample
