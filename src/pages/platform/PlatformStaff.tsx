import { Icons } from '@/components/shared/icons';
import { useState, useEffect } from "react";
import api from "@/lib/api";

import { PageHeader } from "@/components/ui/page-header";
import { SearchInput } from "@/components/ui/search-input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import { PaginationControls } from "@/components/ui/pagination-controls";

export default function PlatformStaff() {
  const [staff, setStaff] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const fetchStaff = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/platform/staff');
      setStaff(data.data);
    } catch (error) {
      console.error("Failed to fetch platform staff", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const filteredStaff = staff.filter(
    (item) =>
      searchQuery === "" ||
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredStaff.length / pageSize);
  const paginatedStaff = filteredStaff.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <PageHeader
        title="Admin Directory"
        description="All system super-admins and platform owners."
        icon={Icons.ShieldAlert}
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-4">
        <SearchInput
          value={searchQuery}
          onChange={(val) => setSearchQuery(val)}
          placeholder="Search staff..."
          className="w-full max-w-sm"
        />
      </div>

      <div className="rounded-md border border-border bg-card overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[300px]">Staff Member</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Loading directory...
                  </TableCell>
                </TableRow>
              ) : filteredStaff.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12">
                    <Icons.ShieldAlert className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium">
                      No staff found
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedStaff.map((member) => (
                  <TableRow
                    key={member.id}
                    className="hover:bg-muted/50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                          <span className="font-bold text-primary">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-foreground">
                            {member.name}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2 text-sm">
                        {member.email && (
                          <div className="flex items-center gap-2.5 text-muted-foreground">
                            <Icons.Mail className="h-3 w-3" />
                            {member.email}
                          </div>
                        )}
                        {member.phone && (
                          <div className="flex items-center gap-2.5 text-muted-foreground">
                            <Icons.Phone className="h-3 w-3" />
                            {member.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          member.role === "super_admin"
                            ? "bg-destructive/10 text-destructive border-destructive/20"
                            : "bg-secondary/10 text-secondary border-secondary/20"
                        }
                      >
                        <Icons.Shield className="w-3 h-3 mr-2" />
                        {member.role === "super_admin"
                          ? "Super Admin"
                          : "Platform Owner"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                        <Icons.Clock className="h-3 w-3" />
                        {new Date(member.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {filteredStaff.length > pageSize && (
            <div className="p-6 border-t border-border/50 bg-card">
              <PaginationControls
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
      </div>
    </div>
  );
}
