import { useState } from "react"
import LabeledInput from "./LabeledInput"
import { facultyInputType} from "@pratikndl/common-schedulizer-ems"
import Button from "./Button"
import config from '../../config.json'
import axios from "axios"
import SelectInput from "./SelectInput"
import useFetchDepartments from "../hooks/useFetchDepartments"
import FormWrapper from "./FormWrapper"




function FacultyForm() {
    const departments = useFetchDepartments("");
    const [data, setData] = useState<facultyInputType | {}>({})
    
    const [prompt, setPrompt] = useState<String>("");
    const [error, setError] = useState(true);
    const [loading, setloading] = useState(false)
        
    const handler = async() => {
        console.log(data)
        setloading(true);
        const headers = {
            Authorization: localStorage.getItem('token')
        }
        try {
            await  axios.post(config.BACKEND_URl+`/faculty`, data, { headers});
            setPrompt("New Faculty Added")
            setError(false)
        }
        catch(e: any){
            if(!e.response.data.message) {
                setPrompt("Something went wrong... Try again later")
            }
            else {
                setPrompt(e.response.data.message);
            }
        }
        setloading(false);

    }


    return (
        <FormWrapper>
            <div className="flex flex-col gap-5 items-center justify-evenly">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                    <LabeledInput label="Name"  placeholder="Pratik" handler={(e) => {setData({...data, name: e.target.value})}}/>
                    <LabeledInput label="Email"  placeholder="pratik@yadav.in" handler={(e) => {setData({...data, email: e.target.value})}}/>
                    <SelectInput handler={(e) => {setData({...data, rank: e.target.value })}} label="Designation"
                        values={[
                            {displayValue: "Assistant Profresor", targetValue: "ASSISTANT_PROFESSOR"},
                            {displayValue: "Associate Profresor", targetValue: "ASSOCIATE_PROFESSOR"},
                            {displayValue: "Professor", targetValue: "PROFESSOR"},
                        ]} />
                    <SelectInput handler={(e) => {setData({...data, departmentId: e.target.value })}} label="Department"
                        values={departments.loading ? [] : departments.data.map((department) => { return{displayValue: department.name, targetValue: department.id}})}/>
                </div>

                <Button addCSS="bg-blue-400" isDisabled={loading} value="Add"  handler={handler}/>
                
                <div className={` text-center font-bold ${error ? 'text-red-500': 'text-green-400'}`}>
                    {prompt}
                </div> 
            </div>
        </FormWrapper>
    
  )
}

export default FacultyForm