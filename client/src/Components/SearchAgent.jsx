import React from 'react'
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

function SearchAgent({ onSearch, searchTerm, setSearchTerm }) {
  const handleClick = async (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className="w-full max-w-3xl p-4 ml-[180px]">
      <div className="relative">
        <Input 
          className="pl-10 h-12 w-[550px] bg-white placeholder:font-abyssinica" 
          placeholder="Person's Name" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5 cursor-pointer" 
          onClick={handleClick} 
        />
      </div>
    </div>
  )
}

export default SearchAgent;