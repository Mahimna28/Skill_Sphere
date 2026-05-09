import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, TrendingUp, Calendar, ArrowRight } from "lucide-react";

export default function ParentProgress() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
          <div className="bg-accent text-black p-2 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"><TrendingUp size={32} /></div>
          Detailed Progress
        </h1>
        <p className="text-muted-foreground font-medium text-lg">In-depth analytics for Alex's academic performance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {["Mathematics", "Physics", "Literature"].map((subject, i) => (
             <Card key={i} className="neo-brutalism-static overflow-hidden">
               <div className="flex flex-col sm:flex-row border-b-2 border-black">
                 <div className={`p-6 sm:w-1/3 border-b-2 sm:border-b-0 sm:border-r-2 border-black flex flex-col items-center justify-center text-center ${
                   i === 0 ? "bg-[#4F7DF3] text-white" : i === 1 ? "bg-[#34D399] text-black" : "bg-[#F9A8D4] text-black"
                 }`}>
                   <div className="text-5xl font-black mb-1">{i === 0 ? "A" : i === 1 ? "B+" : "A-"}</div>
                   <div className="font-bold opacity-90">{i === 0 ? "95%" : i === 1 ? "88%" : "92%"} Overall</div>
                 </div>
                 <div className="p-6 sm:w-2/3 bg-white">
                   <h3 className="font-black text-2xl mb-4">{subject}</h3>
                   <div className="space-y-3">
                     <div>
                       <div className="flex justify-between font-bold text-sm mb-1">
                         <span>Assignments</span>
                         <span>100%</span>
                       </div>
                       <div className="w-full bg-gray-200 h-2 rounded-full border border-black"><div className="bg-black h-full w-[100%] border-r border-black"></div></div>
                     </div>
                     <div>
                       <div className="flex justify-between font-bold text-sm mb-1">
                         <span>Exams</span>
                         <span>{i === 0 ? "90%" : i === 1 ? "82%" : "88%"}</span>
                       </div>
                       <div className="w-full bg-gray-200 h-2 rounded-full border border-black"><div className="bg-black h-full border-r border-black" style={{ width: i === 0 ? '90%' : i === 1 ? '82%' : '88%'}}></div></div>
                     </div>
                   </div>
                 </div>
               </div>
               <div className="p-3 bg-muted/30 text-center">
                 <Button variant="ghost" className="font-bold w-full hover:bg-transparent">View Full Syllabus <ArrowRight className="ml-2 h-4 w-4" /></Button>
               </div>
             </Card>
          ))}
        </div>

        <div className="space-y-6">
          <Card className="neo-brutalism-static bg-white">
            <CardHeader className="border-b-2 border-black bg-primary text-white">
              <CardTitle className="font-black flex items-center gap-2"><Calendar /> Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y-2 divide-black">
                 <div className="p-4 hover:bg-muted/30">
                   <div className="font-bold flex justify-between"><span>Physics Midterm</span> <span className="text-[#ef4444]">Oct 24</span></div>
                   <div className="text-sm font-medium text-muted-foreground mt-1">Covers chapters 1-4</div>
                 </div>
                 <div className="p-4 hover:bg-muted/30">
                   <div className="font-bold flex justify-between"><span>Math Project Due</span> <span className="text-[#F5C84C]">Oct 28</span></div>
                   <div className="text-sm font-medium text-muted-foreground mt-1">Group presentation</div>
                 </div>
                 <div className="p-4 hover:bg-muted/30">
                   <div className="font-bold flex justify-between"><span>Parent-Teacher Conf</span> <span className="text-[#34D399]">Nov 02</span></div>
                   <div className="text-sm font-medium text-muted-foreground mt-1">Room 304, 5:00 PM</div>
                 </div>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
