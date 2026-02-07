import { exec } from "child_process";
import fs from "fs";

import generateNetlist from "../generateNetlist";
import type { StackConfig } from "@/app/features/stack-config/types";

export async function POST(req: Request) {
  console.log("Received simulation request:", req);
  const config: StackConfig = await req.json();
  const netlist: string = generateNetlist(config);

  fs.writeFileSync("/tmp/test.cir", netlist);

  return new Promise((resolve) => {
    exec("ngspice -b /tmp/test.cir", (err, stdout) => {
      if (err) {
        resolve(Response.json({ error: err.message }, { status: 500 }));
      } else {
        resolve(Response.json({ raw: stdout }));
      }
    });
  });
}
