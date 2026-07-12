import { useState, useEffect } from "react";
import { Tag, Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaginationControls } from "@/components/ui/pagination-controls";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Discounts() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterType, setFilterType] = useState("ALL");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const filteredCoupons = coupons.filter((coupon) => {
    if (filterStatus === "ACTIVE" && !coupon.isActive) return false;
    if (filterStatus === "INACTIVE" && coupon.isActive) return false;
    if (filterType !== "ALL" && coupon.discountType !== filterType)
      return false;
    return true;
  });

  const totalPages = Math.ceil(filteredCoupons.length / pageSize);
  const paginatedCoupons = filteredCoupons.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = () => {
    setIsLoading(true);
    // Simulating API Fetch: GET /api/v1/promotions/coupons
    setTimeout(() => {
      setCoupons([
        {
          id: "1",
          code: "SUMMER50",
          discountType: "PERCENTAGE",
          discountValue: "50.00",
          minOrderValue: "500.00",
          maxDiscountAmount: "150.00",
          isActive: true,
          usedCount: 45,
          usageLimit: 100,
          validUntil: new Date(Date.now() + 864000000).toISOString(),
        },
        {
          id: "2",
          code: "WELCOME100",
          discountType: "FLAT",
          discountValue: "100.00",
          minOrderValue: "300.00",
          maxDiscountAmount: null,
          isActive: true,
          usedCount: 12,
          usageLimit: null,
          validUntil: null,
        },
        {
          id: "3",
          code: "WINTER20",
          discountType: "PERCENTAGE",
          discountValue: "20.00",
          minOrderValue: "0.00",
          maxDiscountAmount: "50.00",
          isActive: false,
          usedCount: 500,
          usageLimit: 500,
          validUntil: new Date(Date.now() - 86400000).toISOString(),
        },
      ]);
      setIsLoading(false);
    }, 800);
  };

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDialogOpen(false);
    // Refresh table after creating
    fetchCoupons();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Tag className="h-6 w-6 text-primary" />
            Promotions & Discounts
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create and manage discount codes, BOGO offers, and dynamic pricing
            rules.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger
            render={
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Promo
              </Button>
            }
          />
          <DialogContent className="sm:max-w-md overflow-y-auto max-h-[90vh] bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Create New Promotion</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Configure the discount rules and usage limits for your new promo
                code.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreatePromo} className="space-y-6 mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-foreground">Promo Code</Label>
                  <Input
                    id="code"
                    placeholder="e.g. FESTIVAL50"
                    required
                    className="uppercase bg-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type" className="text-foreground">Discount Type</Label>
                  <Select defaultValue="PERCENTAGE">
                    <SelectTrigger className="bg-transparent">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                      <SelectItem value="FLAT">Flat Amount (₹)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="value" className="text-foreground">Discount Value</Label>
                  <Input
                    id="value"
                    type="number"
                    placeholder="e.g. 50"
                    className="bg-transparent"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minOrder" className="text-foreground">
                    Minimum Order Value (Optional)
                  </Label>
                  <Input id="minOrder" type="number" placeholder="e.g. 500" className="bg-transparent" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxDiscount" className="text-foreground">
                    Max Discount Cap (Optional)
                  </Label>
                  <Input
                    id="maxDiscount"
                    type="number"
                    placeholder="e.g. 150"
                    className="bg-transparent"
                  />
                  <p className="text-xs text-muted-foreground">
                    Only applies to Percentage discounts.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="usageLimit" className="text-foreground">
                    Global Usage Limit (Optional)
                  </Label>
                  <Input
                    id="usageLimit"
                    type="number"
                    placeholder="e.g. 100 (First 100 users)"
                    className="bg-transparent"
                  />
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <Button type="submit" className="w-full">
                  Generate Coupon
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 gap-4">
          <div className="space-y-1">
            <CardTitle>Active Coupons</CardTitle>
            <CardDescription>
              Track the performance of your active discounts.
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                Status:
              </span>
              <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v || 'ALL')}>
                <SelectTrigger className="w-[130px] bg-muted/50">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="ACTIVE">Active Only</SelectItem>
                  <SelectItem value="INACTIVE">Inactive Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                Discount Type:
              </span>
              <Select value={filterType} onValueChange={(v) => setFilterType(v || 'ALL')}>
                <SelectTrigger className="w-[150px] bg-muted/50">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="ALL">All Types</SelectItem>
                  <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                  <SelectItem value="FLAT">Flat Amount (₹)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border mt-4">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead className="text-right">Discount</TableHead>
                  <TableHead>Min. Order</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Loading promotions...
                    </TableCell>
                  </TableRow>
                ) : filteredCoupons.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No promotions match the selected filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedCoupons.map((coupon) => (
                    <TableRow key={coupon.id} className="hover:bg-muted/50">
                      <TableCell className="font-bold text-primary">
                        {coupon.code}
                      </TableCell>
                      <TableCell className="text-foreground text-right">
                        {coupon.discountType === "PERCENTAGE"
                          ? `${coupon.discountValue}% OFF`
                          : `₹${coupon.discountValue} OFF`}
                        {coupon.maxDiscountAmount && (
                          <div className="text-xs text-muted-foreground">
                            Up to ₹{coupon.maxDiscountAmount}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-right">
                        {coupon.minOrderValue &&
                        parseFloat(coupon.minOrderValue) > 0
                          ? `₹${coupon.minOrderValue}`
                          : "None"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="text-sm text-foreground">
                          {coupon.usedCount}{" "}
                          {coupon.usageLimit && `/ ${coupon.usageLimit}`}
                        </div>
                        {coupon.usageLimit && (
                          <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                            <div
                              className="bg-primary h-1.5 rounded-full"
                              style={{
                                width: `${Math.min((coupon.usedCount / coupon.usageLimit) * 100, 100)}%`,
                              }}
                            ></div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {coupon.isActive ? (
                          <Badge
                            variant="outline"
                            className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          >
                            Active
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-background text-muted-foreground border-border"
                          >
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {filteredCoupons.length > pageSize && (
            <div className="mt-4">
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
