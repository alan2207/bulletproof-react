import { ReactNode, useState, useEffect, ReactElement, cloneElement } from 'react';

import { Button } from '../Elements/Button';
import { Drawer } from '../Elements/Drawer';

type FormDrawerProps = {
  isDone: boolean;
  triggerButton: ReactElement;
  submitButton: ReactElement;
  title: string;
  children: ReactNode;
};

export const FormDrawer = ({
  title,
  children,
  isDone,
  triggerButton,
  submitButton,
}: FormDrawerProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isDone) {
      setVisible(false);
    }
  }, [isDone]);

  return (
    <>
      {cloneElement(triggerButton, { onClick: () => setVisible(true) })}
      <Drawer
        isOpen={visible}
        onClose={() => setVisible(false)}
        title={title}
        renderFooter={() => (
          <>
            <Button variant="inverse" size="sm" onClick={() => setVisible(false)}>
              Cancel
            </Button>
            {submitButton}
          </>
        )}
      >
        {children}
      </Drawer>
    </>
  );
};
