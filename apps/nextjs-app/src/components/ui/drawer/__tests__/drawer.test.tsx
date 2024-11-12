import { Button } from '@/components/ui/button';
import { rtlRender, screen, userEvent, waitFor } from '@/testing/test-utils';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../drawer';

const openButtonText = 'Open Drawer';
const titleText = 'Drawer Title';
const cancelButtonText = 'Cancel';
const drawerContentText = 'Hello From Drawer';

const TestDrawer = () => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">{openButtonText}</Button>
      </DrawerTrigger>
      <DrawerContent className="flex max-w-[800px] flex-col justify-between sm:max-w-[540px]">
        <div className="flex flex-col">
          <DrawerHeader>
            <DrawerTitle>{titleText}</DrawerTitle>
          </DrawerHeader>
          <div>{drawerContentText}</div>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button value="outline" type="submit">
              {cancelButtonText}
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

test('should handle basic drawer flow', async () => {
  await rtlRender(<TestDrawer />);

  expect(screen.queryByText(titleText)).not.toBeInTheDocument();

  await userEvent.click(
    screen.getByRole('button', {
      name: openButtonText,
    }),
  );

  expect(await screen.findByText(titleText)).toBeInTheDocument();

  await userEvent.click(
    screen.getByRole('button', {
      name: cancelButtonText,
    }),
  );

  await waitFor(() =>
    expect(screen.queryByText(titleText)).not.toBeInTheDocument(),
  );
});
