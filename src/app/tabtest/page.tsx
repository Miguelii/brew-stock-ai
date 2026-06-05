import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

export default function TabTestPage() {
    return (
        <main className="max-w-7xl mx-auto px-6 py-10">
            <Tabs defaultValue="feedback">
                <TabsList>
                    <TabsTrigger value="feedback">Feedback</TabsTrigger>
                    <TabsTrigger value="users">Users</TabsTrigger>
                    <TabsTrigger value="reports">Reports</TabsTrigger>
                    <TabsTrigger value="actions">Actions</TabsTrigger>
                </TabsList>

                <TabsContent value="feedback">
                    <div className="rounded-none border border-border p-6">
                        Feedback panel content
                    </div>
                </TabsContent>
                <TabsContent value="users">
                    <div className="rounded-none border border-border p-6">Users panel content</div>
                </TabsContent>
                <TabsContent value="reports">
                    <div className="rounded-none border border-border p-6">
                        Reports panel content
                    </div>
                </TabsContent>
                <TabsContent value="actions">
                    <div className="flex min-h-48 flex-col items-center justify-center gap-1 rounded-none border border-dashed border-border text-center">
                        <p className="text-sm font-medium">Actions</p>
                        <p className="text-sm text-muted-foreground">Coming soon.</p>
                    </div>
                </TabsContent>
            </Tabs>
        </main>
    )
}
