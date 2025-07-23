"use client";

import { Accordion } from "@/components/ui/accordion";
import React from "react";

const page = () => {
  return (
    <Accordion mode="multiple" className="border border-gray-300 rounded-md">
      <Accordion.Item value="item-1">
        <Accordion.Header>
          <Accordion.Trigger>Product Information</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <div className="flex flex-col text-balance px-4 py-4">
            <p>
              Our flagship product combines cutting-edge technology with sleek
              design. Built with premium materials, it offers unparalleled
              performance and reliability.
            </p>
            <p>
              Key features include advanced processing capabilities, and an
              intuitive user interface designed for both beginners and experts.
            </p>
          </div>
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item value="item-2">
        <Accordion.Header>
          <Accordion.Trigger>Section 2</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="flex flex-col gap-4 text-balance">
          <div className="flex flex-col text-balance px-4 py-4">
            <p>
              We offer worldwide shipping through trusted courier partners.
              Standard delivery takes 3-5 business days, while express shipping
              ensures delivery within 1-2 business days.
            </p>
            <p>
              All orders are carefully packaged and fully insured. Track your
              shipment in real-time through our dedicated tracking portal.
            </p>
          </div>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
};

export default page;
