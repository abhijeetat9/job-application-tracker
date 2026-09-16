export function InputBox({label, type= "text", name, value, onChange, isRequired = false}) {
    return <div>
        <div className="block text-gray-700 text-sm font-bold mb-2">{label}</div>
        <input
            name={name}
            value={value}
            type={type}
            onChange={onChange}
            className="w-full px-2 py-1 border rounded border-slate-200"
            required={isRequired}
        />
    </div>
}