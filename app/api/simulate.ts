import { exec } from "child_process";
import fs from "fs";

import generateNetlist from "./generateNetlist";

export async function POST(req: Request) {
  const config = await req.json();
  const netlist = generateNetlist(config);

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
