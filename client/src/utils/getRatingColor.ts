export function getRatingColor(rating: number): string {
    switch (rating) {
        case 1:
          return 'danger'
        case 2:
          return 'warning'
        case 3:
          return 'primary'
        default:
          return 'success'
      }
}