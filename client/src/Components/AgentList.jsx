import hero from './hero.jpg'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { ArrowRight } from "lucide-react"
import { Button } from './ui/button';
import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);


function AgentList({ agents, onSelectAgent}) {  // Receive agents as prop
  // Remove all the useState and useEffect hooks related to fetching data
  const [sort, setSort] = useState("asc");
  const root = useRef(null);
  

  const SortedAgents = [...agents].sort((a,b)=>{
      return sort === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    } );

  // Subtle motion: rows rise in as they scroll into view, and the photo zooms gently on hover.
  // Both are skipped for visitors who prefer reduced motion (hover also only on devices with hover).
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.set('.agent-row', { autoAlpha: 0, y: 30 });
        ScrollTrigger.batch('.agent-row', {
          start: 'top 92%',
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.12,
              ease: 'power3.out',
              clearProps: 'all',
              overwrite: true,
            }),
        });
      });

      mm.add('(hover: hover) and (prefers-reduced-motion: no-preference)', () => {
        const cleanups = [];
        gsap.utils.toArray('.agent-row').forEach((row) => {
          const img = row.querySelector('img');
          if (!img) return;
          const enter = () => gsap.to(img, { scale: 1.06, duration: 0.6, ease: 'power2.out', overwrite: 'auto' });
          const leave = () => gsap.to(img, { scale: 1, duration: 0.6, ease: 'power2.out', overwrite: 'auto' });
          row.addEventListener('mouseenter', enter);
          row.addEventListener('mouseleave', leave);
          cleanups.push(() => {
            row.removeEventListener('mouseenter', enter);
            row.removeEventListener('mouseleave', leave);
          });
        });
        return () => cleanups.forEach((fn) => fn());
      });
    }, root);

    return () => ctx.revert();
  }, [agents, sort]);

  


  return (
    <div ref={root}>
      <div className="flex items-center gap-4 font-abyssinica justify-end mr-4 sm:mr-8 lg:mr-[180px] mt-10  ">
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
  
      {/* Desktop: 140px in from the left and 180px from the right, so the rows end exactly under the sort dropdown (same 180px right margin). Smaller screens use even side padding */}
      <div className='w-full px-4 sm:px-8 lg:pl-[140px] lg:pr-[180px]'>
      <div className=" mt-10 lg:mt-[85px] w-full lg:w-[290px]">
            <h1 className="text-3xl font-serif text-gray-900">Nationwide Agents</h1>
            <p className="text-base text-gray-600 font-abyssinica">{agents.length} results</p>

          </div>
       {SortedAgents.length > 0 ? (
        <div >
          {SortedAgents.map((agent, index) => (
            <div
              key={agent._id || index}
              className="agent-row grid grid-cols-1 sm:grid-cols-[160px,1fr] lg:grid-cols-[240px,1fr,auto] gap-4 sm:gap-8 items-start mt-[40px] h-auto lg:h-[200px] pb-6 lg:pb-0"
            >
              <div
               className="lg:aspect-[3/4] relative overflow-hidden cursor-pointer"
               onClick={()=>onSelectAgent(agent)}>
                <img src={agent.img} alt={agent.name}  className="object-cover grayscale h-[180px] w-full max-w-[200px]" />
              </div>
              <div className="space-y-4 min-w-0">
                <div className="space-y-1">
                  <h2 className="text-2xl font-serif text-gray-900">{agent.name}</h2>
                  <p className="text-sm tracking-wider text-gray-600">{agent.location}</p>
                </div>
                <div className="space-y-1 pt-2">
                  <p className="text-lg text-gray-900">Basnet's International Realty</p>
                  <p className="text-base text-gray-600 break-words">{agent.email}</p>
                </div>
              </div>
              <div className="sm:col-span-2 lg:col-span-1 text-left lg:text-right space-y-3 lg:space-y-8">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">CONTACT</p>
                  <p className="text-base text-gray-900">{agent.phoneNumber}</p>
                </div>
                <Button
                  variant="link"
                  onClick={()=>onSelectAgent(agent)}
                  className="h-8 px-0 text-gray-900 hover:text-gray-600 font-medium"
                >
                  SEND MESSAGE <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="sm:col-span-2 lg:col-span-3">
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


    </div>
  );
}

export default AgentList;5