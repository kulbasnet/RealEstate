import hero from './hero.jpg'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight } from "lucide-react"
import { Button } from './ui/button';
import { useState } from 'react';


function AgentList({ agents, onSelectAgent}) {  // Receive agents as prop
  // Remove all the useState and useEffect hooks related to fetching data
  const [sort, setSort] = useState("asc");
  

  const SortedAgents = [...agents].sort((a,b)=>{
      return sort === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    } );

  


  return (
    <>
      <div className="flex items-center gap-4 font-abyssinica justify-end mr-[180px] mt-10  ">
          <Select defaultValue="a-z" onValueChange={(value)=> setSort(value ==="z-a" ? "desc" : "asc" )}>
            <SelectTrigger className="w-[180px] border-gray-300">
              <SelectValue placeholder="SORT: SORT A-Z" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a-z">SORT: SORT A-Z</SelectItem>
              <SelectItem value="z-a">SORT: SORT  Z-A</SelectItem>
            </SelectContent>
          </Select>
          
        </div>
  
      <div className='justify-center w-[1200px] ml-[140px]'>
      <div className=" mt-[85px] w-[290px]">
            <h1 className="text-3xl font-serif text-gray-900">Nationwide Agents</h1>
            <p className="text-base text-gray-600 font-abyssinica">{agents.length} results</p>

          </div>
       {SortedAgents.length > 0 ? (
        <div >
          {SortedAgents.map((agent, index) => (
            <div key={index} className=" grid grid-cols-[240px,1fr,auto] gap-8 items-start mt-[40px] h-[200px]">
              <div
               className="aspect-[3/4] relative overflow-hidden"
               key={index}
               onClick={()=>onSelectAgent(agent)}>
                <img src={agent.img} alt={agent.name}  className="object-cover grayscale h-[180px] w-[200px]" />
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-2xl font-serif text-gray-900">{agent.name}</h2>
                  <p className="text-sm tracking-wider text-gray-600">{agent.location}</p>
                </div>
                <div className="space-y-1 pt-2">
                  <p className="text-lg text-gray-900">Basnet's International Realty</p>
                  <p className="text-base text-gray-600">{agent.email}</p>
                </div>
              </div>
              <div className="text-right space-y-8">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">CONTACT</p>
                  <p className="text-base text-gray-900">{agent.phoneNumber}</p>
                </div>
                <Button variant="link" className="h-8 px-0 text-gray-900 hover:text-gray-600 font-medium">
                  SEND MESSAGE <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="col-span-3">
      <hr className="border-gray-300 " />
    </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p>No agents found</p>
        </div>
      )}

    </div>


    </>
  );
}

export default AgentList;