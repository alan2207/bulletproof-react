import { Meta, StoryObj } from '@storybook/react';

import { Button } from '@/components/ui/button';
import { useDisclosure } from '@/hooks/use-disclosure';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './drawer';

const meta: Meta<typeof Drawer> = {
  component: Drawer,
};

export default meta;

type Story = StoryObj<typeof Drawer>;

const DemoDrawer = () => {
  const { close, open, isOpen } = useDisclosure();

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          close();
        } else {
          open();
        }
      }}
    >
      <DrawerTrigger asChild>
        <Button variant="outline">Open</Button>
      </DrawerTrigger>
      <DrawerContent className="flex max-w-[800px] flex-col justify-between sm:max-w-[540px]">
        <div className="flex flex-col">
          <DrawerHeader>
            <DrawerTitle>Drawer Header</DrawerTitle>
            <DrawerDescription>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </DrawerDescription>
          </DrawerHeader>
          <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button type="submit">Save changes</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export const Default: Story = {
  render: () => <DemoDrawer />,
};
