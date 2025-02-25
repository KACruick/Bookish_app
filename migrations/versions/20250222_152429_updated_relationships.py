"""Updated relationships

Revision ID: 84b908143ab6
Revises: 97fdbfff1510
Create Date: 2025-02-22 15:24:29.078334

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import ENUM
from sqlalchemy import Enum
from app.models.community_post import ActivityTypeEnum 


# revision identifiers, used by Alembic.
revision = '84b908143ab6'
down_revision = '97fdbfff1510'
branch_labels = None
depends_on = None


def upgrade():
    # Create the ActivityTypeEnum directly in the migration (for PostgreSQL)
    activity_type_enum = ENUM(
        'add_tbr', 'add_reading', 'add_read', 'rate', 'review', 'update_status',
        name='activitytypeenum', create_type=True
    )
    
    # If using SQLite, we can just leave the column as a String (SQLite doesn't support ENUM types)
    op.add_column('community_posts', sa.Column('new_activityType', sa.String(), nullable=False))
    
    # Manually migrate data from old activityType column to new_activityType column (if using SQLite)
    op.execute('UPDATE community_posts SET new_activityType = activityType')
    
    # Drop the old activityType column (SQLite limitation)
    op.drop_column('community_posts', 'activityType')

    # Rename new column to activityType (SQLite workaround)
    op.alter_column('community_posts', 'new_activityType', new_column_name='activityType')

def downgrade():
    # Reverse the changes made in upgrade() method if you want to downgrade
    op.add_column('community_posts', sa.Column('old_activityType', sa.String(), nullable=False))
    op.execute('UPDATE community_posts SET old_activityType = activityType')
    op.drop_column('community_posts', 'activityType')
    op.alter_column('community_posts', 'old_activityType', new_column_name='activityType')
