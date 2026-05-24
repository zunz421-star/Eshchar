import java.awt.Color;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.geom.Ellipse2D;
import javax.swing.JFrame;
import javax.swing.JPanel;

public class CircleDemo extends JPanel {
    private static final int WIDTH = 500;
    private static final int HEIGHT = 500;

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        Graphics2D g2 = (Graphics2D) g;

        int[] centersX = {80, 170, 260, 350, 430};
        int[] centersY = {80, 170, 260, 350, 430};
        int radius = 50;

        for (int i = 0; i < centersX.length; i++) {
            float hue = i / (float) centersX.length;
            g2.setColor(Color.getHSBColor(hue, 1.0f, 1.0f));
            g2.fill(new Ellipse2D.Double(
                    centersX[i] - radius,
                    centersY[i] - radius,
                    radius * 2.0,
                    radius * 2.0
            ));
        }

        g2.setColor(Color.BLACK);
        g2.drawString("דוגמת עיגולים ב-Java", 180, 480);
    }

    public static void main(String[] args) {
        JFrame frame = new JFrame("CircleDemo");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.add(new CircleDemo());
        frame.setSize(WIDTH, HEIGHT);
        frame.setLocationRelativeTo(null);
        frame.setVisible(true);
    }
}
