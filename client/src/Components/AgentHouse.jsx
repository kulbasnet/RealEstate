import axios from "axios";
import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/Components/ui/alert-dialog";
import Delte from "./Delte";
import UpdateHouse from "./UpdateHouse";
import TableSkeleton from "./TableSkeleton";

// Small colored pill for the Sale / Rent status
function StatusBadge({ status }) {
  if (!status) return <span className="text-muted-foreground">—</span>;
  const isSale = String(status).toLowerCase() === "sale";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isSale ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"
      }`}
    >
      {isSale ? "For Sale" : status}
    </span>
  );
}

const th = "whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-gray-500";
const td = "whitespace-nowrap";

export default function AgentHouse() {
  const [agentHouse, setAgentHouse] = useState([]);
  const [isloading, setLoading] = useState(true);

  const getAgentHouse = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log("No authentication found");
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get("/house/agentHouse", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setAgentHouse(response.data.agentHouse);
      } else {
        console.log(response.data.error);
      }
    } catch (error) {
      console.log(`Error: ${error.message}`);
    } finally {
      // Always stop the skeleton, even when the request fails
      setLoading(false);
    }
  };

  useEffect(() => {
    getAgentHouse();
  }, []);

  return (
    <div className="container mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#b98604]">Property Listings</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Manage your property listings here.</p>
        </div>
        {!isloading && (
          <span className="mt-2 sm:mt-0 inline-flex w-fit items-center rounded-full bg-[#081740]/5 px-3 py-1 text-sm font-medium text-[#081740]">
            {agentHouse.length} {agentHouse.length === 1 ? "listing" : "listings"}
          </span>
        )}
      </div>

      <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
        {isloading && Array(3).fill(0).map((_, index) => <TableSkeleton key={index} />)}

        {/* The table scrolls sideways on small screens instead of breaking the page */}
        <div className="w-full overflow-x-auto">
          <Table className="min-w-[1100px]">
            <TableHeader className="bg-gray-50">
              <TableRow className="hover:bg-gray-50">
                <TableHead className={th}></TableHead>
                <TableHead className={th}>Location</TableHead>
                <TableHead className={th}>Price</TableHead>
                <TableHead className={th}>Size</TableHead>
                <TableHead className={th}>Property Number</TableHead>
                <TableHead className={th}>Property Type</TableHead>
                <TableHead className={th}>Bedroom</TableHead>
                <TableHead className={th}>Bathrooms</TableHead>
                <TableHead className={th}>Status</TableHead>
                <TableHead className={th}>Description</TableHead>
                <TableHead className={`${th} text-right sticky right-0 bg-gray-50`}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agentHouse.length > 0 ? (
                agentHouse.map((house, index) => (
                  <TableRow key={house._id || index} className="group hover:bg-gray-50/70 transition-colors">
                    <TableCell className="w-[190px] min-w-[190px]">
                      <img
                        src={house.img}
                        alt={house.location ? `Property in ${house.location}` : "Property"}
                        loading="lazy"
                        className="h-[96px] w-[160px] rounded-md object-cover bg-gray-100"
                      />
                    </TableCell>
                    <TableCell className={`${td} font-medium text-gray-900`}>{house.location}</TableCell>
                    <TableCell className={`${td} font-medium`}>
                      {house.price != null ? `$${Number(house.price).toLocaleString()}` : "—"}
                    </TableCell>
                    <TableCell className={td}>{house.size}</TableCell>
                    <TableCell className={td}>{house.propertyNumber}</TableCell>
                    <TableCell className={td}>{house.propertyType}</TableCell>
                    <TableCell className={td}>{house.Bedroom || "—"}</TableCell>
                    <TableCell className={td}>{house.Bathrooms || "—"}</TableCell>
                    <TableCell className={td}>
                      <StatusBadge status={house.status} />
                    </TableCell>
                    <TableCell className="max-w-[260px]">
                      <p className="truncate text-gray-600" title={house.Description}>
                        {house.Description}
                      </p>
                    </TableCell>

                    <TableCell className="text-right sticky right-0 bg-white group-hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col items-end gap-1 sm:flex-row sm:justify-end">
                        <UpdateHouse houseId={house._id} key={house._id} />

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" className="hover:text-red-600" aria-label="Delete property">
                              <Trash2 />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="w-[calc(100%-2rem)] max-w-lg">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your House and remove your House information from our
                                servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction className="bg-[#081740] hover:bg-[#DB9F05]">
                                <Delte houseId={house._id} />
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                !isloading && (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={11} className="h-40 text-center text-muted-foreground">
                      No properties listed yet. Click “Add New” to create your first listing.
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}