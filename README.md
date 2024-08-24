# Google Fonts Header Card

A Lovelace card to display headers using Google Fonts in your Home Assistant Dashboards

![example](image.png)

## Support

Hey dude! Help me out for a couple of :beers: or a :coffee:!

[![coffee](https://www.buymeacoffee.com/assets/img/custom_images/black_img.png)](https://buymeacoffee.com/bathansneard)

## Options

| Name                  | Type    | Requirement  | Description                                    | Default              |
| -----------------     | ------- | ------------ | -------------------------------------------    | -------------------  |
| type                  | string  | **Required** | `custom:google-fonts-header-card`              |                      |
| heading               | string  | **Required** | Your heading text                              |                      |
| font                  | string  | **Required** | Google Fonts font name                         |                      |
| font_size             | string  | **Optional** | CSS Font Size                                  | 1em                  |
| font_weight           | string  | **Optional** | CSS Font Weight                                | 900                  |
| show_blob             | boolean | **Optional** | Toggle the animated blob                       | false                |
| color_gradient_top    | string  | **Optional** | CSS Color for the top part of the gradient     | var(--primary-color) |
| color_gradient_bottom | string  | **Optional** | CSS Color for the bottom part of the gradient  | var(--accent-color)  |
| blob_animation_speed  | string  | **Optional** | Speed of the animation                         | 0.01                 |