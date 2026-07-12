import { useState, useEffect } from "react";
import api from "@/lib/api";
import { ShieldAlert, Shield, Search, Mail, Phone, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-primary" />
            Platform Staff & Admins
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage system administrators and platform owners.
          </p>
        </div>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="border-b border-border/50 pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Admin Directory</CardTitle>
              <CardDescription>
                All system super-admins and platform owners.
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search staff..."
                className="pl-9 w-64 bg-muted/50"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
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
                    <ShieldAlert className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
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
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
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
                      <div className="space-y-1 text-sm">
                        {member.email && (
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {member.email}
                          </div>
                        )}
                        {member.phone && (
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Phone className="h-3 w-3" />
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
                            : "bg-primary/10 text-primary border-primary/20"
                        }
                      >
                        <Shield className="w-3 h-3 mr-1" />
                        {member.role === "super_admin"
                          ? "Super Admin"
                          : "Platform Owner"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
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
        </CardContent>
      </Card>
    </div>
  );
}
